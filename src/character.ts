import { Character, Clients, defaultCharacter, ModelProviderName } from "@elizaos/core";
import { HEURIST_AGENT_NAMES, HEURIST_TRIGGER_QUERIES } from "./utils/constants.ts";
import fs from "fs/promises";
import path from "path";

const filePath = path.resolve("./characters/acai.character.json");
const characterJson = JSON.parse(await fs.readFile(filePath, "utf-8"));

const knowledge = [
    `We have access to these HEURIST agents: ${HEURIST_AGENT_NAMES.join(',')}`,
    "CoinGeckoTokenInfoAgent can fetch token information, market data, trending coins, and category data from CoinGecko. It has these API functions: get_token_info, get_trending_coins, get_token_price_multi, get_categories_list, get_category_data, get_tokens_by_category",
    "DexScreenerTokenInfoAgent fetches real-time DEX trading data and token information across multiple chains using DexScreener API. It has these API functions: search_pairs, get_specific_pair_info, get_token_pairs.",
    "BitquerySolanaTokenInfoAgent provides comprehensive analysis of Solana tokens using Bitquery API. It supports token metrics analysis (volume, price, liquidity), tracking holders and buyers, monitoring trading activity, and discovering trending tokens. It has these API functions: query_token_metrics, query_token_holders, query_token_buyers, query_top_traders, query_holder_status, get_top_trending_tokens.",
    "PumpFunTokenAgent analyzes Pump.fun tokens on Solana using Bitquery API. It tracks token creation and graduation events. It has these API functions: query_recent_token_creation, query_latest_graduated_tokens.",
    "TwitterInfoAgent fetches a Twitter user's profile information and recent tweets. Useful for tracking project updates or KOLs. It has these API functions: get_user_tweets, get_twitter_detail, get_general_search.",
    "TokenMetricsAgent provides market insights, sentiment analysis, and resistance/support data for cryptocurrencies using TokenMetrics API. It has these API functions: get_sentiments, get_resistance_support_levels.",
    "SolWalletAgent queries Solana wallet assets and recent swap transactions using Helius API. It has these API functions: get_wallet_assets, analyze_common_holdings_of_top_holders, get_tx_history.",
    "AIXBTProjectInfoAgent can retrieve trending project information including fundamental analysis, social activity, and recent developments using the aixbt API. It has these API functions: search_projects.",
    "PondWalletAnalysisAgent analyzes cryptocurrency wallet activities across Ethereum, Solana, and Base networks using the Cryptopond API. It has these API functions: analyze_ethereum_wallet, analyze_solana_wallet, analyze_base_wallet.",
    "AlloraPricePredictionAgent can predict the price of ETH/BTC with confidence intervals using Allora price prediction API. It has this API function: get_allora_prediction.",
    "DeepResearchAgent performs multi-level web searches with recursive exploration, analyzes content across sources, and produces comprehensive research reports with key insights. It has this API function: deep_research.",
    "MemoryAgent maintains conversation history across sessions and platforms. It can query the conversation history and store new conversations. It has these API functions: store_conversation, retrieve_conversations."
];

export const character: any = {
    ...characterJson,
    knowledge,
};
