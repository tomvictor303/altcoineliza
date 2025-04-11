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
