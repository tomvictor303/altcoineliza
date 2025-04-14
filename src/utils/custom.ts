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


function format(num: number): string {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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
        console.log('json', json)
        if (!json.data?.length) {
            throw new Error(`Invalid response for type: getTokenPrices`);
        }

        return json.data;
    } catch (err) {
        console.error(`Error fetching latest token prices from cryptorank:`, err);
        return [];
    }
}

export async function getTokenPricesFormatted(): Promise<string> {
    const items: Array<TokenPriceItem> = await getTokenPrices();
    if (!items.length) return 'No token prices available.';

    const lines = items.map(item => `${item.name}: ${item.price} $`);
    const pricestext = lines.join('\n');
    const content = `
📊 **Token Prices**
` + pricestext;
    return content;
}