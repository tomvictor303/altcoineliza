export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function format(num: number): string {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
}

type InflowItem = {
    date: string;
    totalNetInflow: number;
    totalValueTraded: number;
    totalNetAssets: number;
    cumNetInflow: number;
};

type InflowData = {
    btc: InflowItem | null;
    eth: InflowItem | null;
};

// hey
export async function getInflowData(): Promise<InflowData> {
    const url = 'https://api.sosovalue.xyz/openapi/v2/etf/historicalInflowChart';
    const apiKey = process.env.SOSO_API_KEY;
    const headers = {
        'x-soso-api-key': apiKey,
        'Content-Type': 'application/json'
    };

    const fetchLatest = async (type: string): Promise<InflowItem | null> => {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify({ type })
            });

            const json = await res.json();
            if (json.code !== 0 || !json.data?.length) {
                throw new Error(`Invalid response for type: ${type}`);
            }

            return json.data[0]; // Most recent item is first
        } catch (err) {
            console.error(`Error fetching latest ${type} inflow:`, err);
            return null;
        }
    };

    const [btc, eth] = await Promise.all([
        fetchLatest('us-btc-spot'),
        fetchLatest('us-eth-spot')
    ]);

    return { btc, eth };
}

export async function getInflowDataFormatted(): Promise<string> {
    const inflow = await getInflowData();

    if (!inflow.btc || !inflow.eth) {
        return "⚠️ Could not fetch ETF inflow data.";
    }

    const content = `
📊 **ETF Inflow Snapshot**

🟡 **BTC**
• Date: ${inflow.btc.date}
• Net Inflow: $${format(inflow.btc.totalNetInflow)}
• Assets: $${format(inflow.btc.totalNetAssets)}

🔵 **ETH**
• Date: ${inflow.eth.date}
• Net Inflow: $${format(inflow.eth.totalNetInflow)}
• Assets: $${format(inflow.eth.totalNetAssets)}
    `.trim();
    
    return content
}
  
type TokenPriceItem = {
    id: number; // numberic id from cryptorank
    key: string;
    symbol: string;
    name: string;
    rank: number; // rank from cryptorank
    price: string; // price in usd
};

export async function getTokenPrices(): Promise<Array<TokenPriceItem>> {
    const url = 'https://api.cryptorank.io/v2/currencies';
    const apiKey = process.env.CRYPTORANK_API_KEY;
    const headers = {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
    };

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers,
        });

        const json = await res.json();
        if (!json.data?.length) {
            throw new Error(`Invalid response for type: getTokenPrices`);
        }

        return json.data;
    } catch (err) {
        console.error(`Error fetching latest token prices from cryptorank:`, err);
        return [];
    }
}

export async function getTokenPricesFormatted(): Promise<Array<string>> {
    const items: Array<TokenPriceItem> = await getTokenPrices();
    if (!items.length) return ['No token prices available.'];

    const chunkSize = 50;
    const chunks: Array<string> = [];

    for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        const lines = chunk.map(item => `${item.name}: ${item.price} $`);
        const pricestext = lines.join('\n');
        const start = i + 1;
        const end = i + chunk.length;
        const content = `📊 **Token Prices (${start}~${end})**\n\n` + pricestext;
        chunks.push(content);
    }

    return chunks;
}

export interface CryptoCurrency {
    id: number;
    key: string;
    symbol: string;
    name: string;
}

// Define the cache structure
type CryptoCurrencyListCache = {
    data: Array<CryptoCurrency>;
    timestamp: number;
};

// In-memory cache to store the cryptocurrency list
const cryptoCurrencyListCache: CryptoCurrencyListCache = {
    data: [],
    timestamp: 0,
};

// Function to fetch cryptocurrency list from the API
async function fetchCryptoCurrencyList(): Promise<Array<CryptoCurrency>> {
    const url = 'https://api.cryptorank.io/v2/currencies/map';  // Updated API URL
    const apiKey = process.env.CRYPTORANK_API_KEY;
    const headers = {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
    };

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch data: ${res.statusText}`);
        }

        const json = await res.json();
        if (!json.data?.length) {
            throw new Error(`Invalid response for API: fetchCryptoCurrencyList`);
        }

        // Map API response to the CryptoCurrency interface
        return json.data.map((item: any) => ({
            id: item.id,
            key: item.key,
            symbol: item.symbol,
            name: item.name,
        }));
    } catch (error) {
        console.error('Error fetching cryptocurrency list:', error);
        throw error;
    }
}

// Function to get the cryptocurrency list from cache or API
export async function getCryptoCurrencyList(): Promise<Array<CryptoCurrency>> {
    const currentTime = Date.now();
    // Cache TTL: 8 hours (in milliseconds)
    const cacheTtl = 8 * 60 * 60 * 1000; // 8 hours

    // Check if the cache is valid (within TTL)
    if (cryptoCurrencyListCache.timestamp && currentTime - cryptoCurrencyListCache.timestamp < cacheTtl) {
        console.log('Returning cached cryptocurrency list');
        return cryptoCurrencyListCache.data;
    }

    console.log('Fetching new cryptocurrency list from API');
    const cryptoList = await fetchCryptoCurrencyList();
    
    // Cache the new data and update the timestamp
    cryptoCurrencyListCache.data = cryptoList;
    cryptoCurrencyListCache.timestamp = currentTime;

    return cryptoList;
}

type PriceCache = {
    [currencyId: number]: {
      price: number;
      timestamp: number;
    };
};
  
const priceCache: PriceCache = {};
  
export const getTokenPriceById = async (currencyId: number): Promise<number> => {
    const now = Date.now();
    const cached = priceCache[currencyId];
  
    // Return cached value if under 10 seconds old
    const timeLimit = 10 * 1000;
    if (cached && now - cached.timestamp < timeLimit) {
        console.log(`Returning cached price for Id: ${currencyId}`);
        return cached?.price ?? -1; // -1 means invalid price
    }
    console.log(`Fetching price from API for Id: ${currencyId}`);
  
    const url = `https://api.cryptorank.io/v2/currencies/${currencyId}`;
    const apiKey = process.env.CRYPTORANK_API_KEY;
    const headers = {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
    };
  
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch data: ${res.statusText}`);
        }
        const json = await res.json();      
        if (!json?.data || json?.data?.price === undefined) {
            throw new Error(`Invalid response for API: getTokenPriceById`);
        }
        const price = json.data.price;
    
        priceCache[currencyId] = { price, timestamp: now };
        return price;
    } catch (error) {
        console.error(`Error fetching ${currencyId} price:`, error);
        return -1; // -1 means invalid price
    }
};

export async function getTokenPriceFormatted(cryptoCurrency: CryptoCurrency): Promise<string> {
    if (!cryptoCurrency) {
       return `⚠️ Invalid CryptoCurrency Object Provided`;
    }
    const price = await getTokenPriceById(cryptoCurrency.id);

    if (price === -1 || price === null || price === undefined) {
        return "⚠️ Could not fetch Price data";
    }

    const content = `📊 **${cryptoCurrency.name} (${cryptoCurrency.symbol})** price: ${price} USD`.trim();
    
    return content
}
  