export const HEURIST_AGENT_NAMES = [
  "CoinGeckoTokenInfoAgent", 
  "DexScreenerTokenInfoAgent", 
  "BitquerySolanaTokenInfoAgent", 
  "PumpFunTokenAgent", 
  "TwitterInfoAgent", 
  "TokenMetricsAgent",        
  "SolWalletAgent",
  "AIXBTProjectInfoAgent",
  "PondWalletAnalysisAgent",
  "AlloraPricePredictionAgent",
  "DeepResearchAgent",
  "MemoryAgent",
];

export const HEURIST_AGENT_EXAMPLES = {
  "CoinGeckoTokenInfoAgent": [
    "Top 5 crypto by market cap",
    "24-hr price change of ETH",
    "Get information about HEU",
    "Analyze AI16Z token",
    "List crypto categories",
    "Compare DeFi tokens",
  ],
  "DexScreenerTokenInfoAgent": [    
    "Show me information about UNI on Uniswap",
    "Recent price movement for HEU",
    "Recent trading activity for TRUMP token on Solana?",
    "Analyze JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN on Solana",
  ],
  "BitquerySolanaTokenInfoAgent": [    
    "Analyze trending tokens on Solana",
    "Get token info for HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC",
    "Show top 10 most active tokens on Solana network",
  ],
  "PumpFunTokenAgent": [
    "Latest token launched on Pump.fun in the last 24 hours",
  ],
  "TwitterInfoAgent": [    
    "Summarise recent updates of @heurist_ai",
    "What has @elonmusk been tweeting lately?",
    "Get the recent tweets from cz_binance",
  ],
  "TokenMetricsAgent": [    
    "What is the current crypto market sentiment?",
    "Show me resistance and support levels for ETH",
    "resistance and support levels for Solana",
  ],
  "SolWalletAgent": [    
    "All token holdings for a Solana wallet address 8XZGkQW7xzwoe8UQd7LP9TPvE7yBzk5A6KYZm2LqL6L2",
    "Analyze the top tokens commonly held by the holders of Solana token",
    "Fetch and analyze recent SWAP transactions for a Solana wallet address 8XZGkQW7xzwoe8UQd7LP9TPvE7yBzk5A6KYZm2LqL6L2",
  ],  
  "AIXBTProjectInfoAgent": [
    "Tell me about Heurist",
    "What are the latest developments for Ethereum?",
    "Trending projects in the crypto space",
  ],
  "PondWalletAnalysisAgent": [    
    "Analyze Ethereum wallet 0x2B25B37c683F042E9Ae1877bc59A1Bb642Eb1073",
    "What's the trading volume for Solana wallet 8gc59zf1ZQCxzkSuepV8WmuuobHCPpydJ2RLqwXyCASS?",
    "Check the transaction activity for Base wallet 0x97224Dd2aFB28F6f442E773853F229B3d8A0999a",
  ],
  "AlloraPricePredictionAgent": [    
    "What is the price prediction for BTC in the next 5 minutes?",
    "Price prediction for ETH in the next 8 hours",
  ],
  "MemoryAgent": [    
    "Save our conversation to memory",
    "What did we talk about in our last conversation?",
    "Summarize our previous conversations"
  ],
};

export const HEURIST_TRIGGER_QUERIES = [
  // CoinGeckoTokenInfoAgent
  "Question related to CoinGecko",
  ...HEURIST_AGENT_EXAMPLES['CoinGeckoTokenInfoAgent'],
  // DexScreenerTokenInfoAgent
  "Question about DexScreener API or DexScreenerTokenInfoAgent",
  ...HEURIST_AGENT_EXAMPLES['DexScreenerTokenInfoAgent'],
  // BitquerySolanaTokenInfoAgent  
  ...HEURIST_AGENT_EXAMPLES['BitquerySolanaTokenInfoAgent'],
  // PumpFunTokenAgent
  "Question related to Pump.fun",
  ...HEURIST_AGENT_EXAMPLES['PumpFunTokenAgent'],
  // TwitterInfoAgent
  ...HEURIST_AGENT_EXAMPLES['TwitterInfoAgent'],
  // TokenMetricsAgent  
  ...HEURIST_AGENT_EXAMPLES['TokenMetricsAgent'],
  // SolWalletAgent
  ...HEURIST_AGENT_EXAMPLES['SolWalletAgent'],
  // AIXBTProjectInfoAgent
  "Questions about AIXBTProjectInfoAgent or AIXBT API",
  ...HEURIST_AGENT_EXAMPLES['AIXBTProjectInfoAgent'],
  // PondWalletAnalysisAgent
  "Questions about PondWalletAnalysisAgent or Cryptopond API",
  ...HEURIST_AGENT_EXAMPLES['PondWalletAnalysisAgent'],
  // AlloraPricePredictionAgent
  "Questions about Allora price prediction API or AlloraPricePredictionAgent",
  ...HEURIST_AGENT_EXAMPLES['AlloraPricePredictionAgent'],
  // MemoryAgent
  ...HEURIST_AGENT_EXAMPLES['MemoryAgent'],
]