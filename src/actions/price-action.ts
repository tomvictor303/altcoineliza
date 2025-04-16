import { generateText, ModelClass, type Action, type IAgentRuntime, type Memory, type State } from "@elizaos/core";
import { CryptoCurrency, getCryptoCurrencyList, getInflowDataFormatted, getTokenPriceFormatted } from "../utils/custom.ts";

export const getPriceAction: Action = {
  name: "GET_PRICE",
  similes: ["TOKEN_PRICE", "CRYTO_CURRENCY_PRICE", "COIN_PRICE"],
  description: "Gets the price of given cryptocurrency",
  validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
    return true;
  },
  handler: async (runtime, message, state, options, callback) => {
    try {
      console.log(`message.content.inReplyTo`, message.content.inReplyTo);
      console.log(`message.content.text`, message.content.text)
      console.log(`message.content.source`, message.content.source)
      console.log(`message.content.action`, message.content.action)

      const context = `Extract the cryptocurrency name or symbol from the user's message.
                      The message is: ${message.content.text}
                      Only respond with the cryptocurrency name or symbol, do not include any other text.`;
      const searchTerm = await generateText({
        runtime,
        context,
        modelClass: ModelClass.SMALL,
        stop: ["\n"]
      });

      console.log(`searchTerm`, searchTerm)      
      if (!searchTerm || searchTerm === runtime.character.name || searchTerm === 'None' || searchTerm === 'None.') {
        console.log(`searchTerm is not provided or invalid`)
        await callback({ text: `⚠️ Please include cryptocurrency name or symbol in your message` });
        return true;
      }

      const cryptoList: Array<CryptoCurrency> = await getCryptoCurrencyList();
      const pureSearchTerm = searchTerm.replace(/\s+/g, '').toLowerCase();
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
      ⚠️ Could not find cryptocurrency **${searchTerm}**`;

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
