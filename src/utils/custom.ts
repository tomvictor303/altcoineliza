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
