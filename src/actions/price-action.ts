import type { Action, IAgentRuntime, Memory, State } from "@elizaos/core";
import { getInflowDataFormatted } from "../utils/custom.ts";

export const etfInflow: Action = {
  name: "GET_PRICE",
  similes: ["TOKEN_PRICE", "CRYTO_CURRENCY_PRICE", "COIN_PRICE"],
  description: "Gets the price of given cryptocurrency or token or coin",
  validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
    return true;
  },
  handler: async (runtime, message, state, options, callback) => {
    try {
      const text = await getInflowDataFormatted();

      if (callback) {
        await callback({ text });
      }
      
      return true;
    } catch (err) {
      if (callback) {
        await callback({ text: "❌ An error occurred while fetching ETF data." });
      }
      console.error("Action [GET_PRICE] error:", err);
      return false;
    }
  },
  examples: [],
};
