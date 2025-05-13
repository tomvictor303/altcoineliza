import { generateText, ModelClass, type Action, type IAgentRuntime, type Memory, type State } from "@elizaos/core";
import { CryptoCurrency, getCryptoCurrencyList, getInflowDataFormatted, getTokenPriceFormatted } from "../utils/custom.ts";

export const getPriceAction: Action = {
  name: "HEURIST",
  similes: ["GET_HEURIST_DATA"],
  description: "Gets data from HEURIST service.",
  validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
    return true;
  },
  handler: async (runtime, message, state, options, callback) => {
    try {
      console.log(`HEURIST: message.content.inReplyTo`, message.content.inReplyTo);
      console.log(`HEURIST: message.content.text`, message.content.text)
      console.log(`HEURIST: message.content.source`, message.content.source)
      console.log(`HEURIST: message.content.action`, message.content.action)
      
      const agentNames = [
        "CoinGeckoTokenInfoAgent", 
        "DexScreenerTokenInfoAgent", 
        BitquerySolanaTokenInfoAgent, 
        PumpFunTokenAgent, 
        TwitterInfoAgent, 
        TokenMetricsAgent  
        
        SolWalletAgent]
      const context = `Please tell me which HEURIST agent is suitable for the message.
                      Agents are .
                      The message is: ${message.content.text}
                      Only respond with agent name, do not include any other text.
                      If you cannot find out among provided agent names, just reply with appropriate response.`;
      const agentName = await generateText({
        runtime,
        context,
        modelClass: ModelClass.SMALL,
        stop: ["\n"]
      });

      console.log(`HEURIST: agentName`, agentName)      
      if (!agentName || agentName === runtime.character.name || agentName === 'None' || agentName === 'None.') {
        console.log(`agentName is not provided or invalid`)
        await callback({ text: `⚠️ Please include cryptocurrency name or symbol in your message` });
        return true;
      }

      const cryptoList: Array<CryptoCurrency> = await getCryptoCurrencyList();
      const pureSearchTerm = agentName.replace(/\s+/g, '').toLowerCase();
      let searchCryptoCurrency: CryptoCurrency | null = null;
      for (let i = 0; i < cryptoList.length; i++) {
        const pureSymbol = cryptoList[i].symbol?.toLowerCase();
        const pureName = cryptoList[i].name?.toLowerCase();
        if ( pureName === pureSearchTerm || pureSymbol === pureSearchTerm ) {
          searchCryptoCurrency = cryptoList[i];
          break;
        }
      }

      let text = `
      ⚠️ Could not find cryptocurrency **${agentName}**`;

      if (searchCryptoCurrency) {
         text = await getTokenPriceFormatted(searchCryptoCurrency); 
      }

      if (callback) {
        await callback({ text });
      }
      
      return true;
    } catch (err) {
      if (callback) {
        await callback({ text: "❌ An error occurred while fetching price data." });
      }
      console.error("Action [GET_PRICE] error:", err);
      return false;
    }
  },
  examples: [],
};
