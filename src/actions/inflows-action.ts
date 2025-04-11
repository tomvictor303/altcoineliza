import type { Action, IAgentRuntime, Memory, State } from "@elizaos/core";
import { getInflowDataFormatted } from "../utils/custom.ts";

export const etfInflow: Action = {
  name: "ETF_INFLOW",
  similes: [],
  description: "Gets the latest BTC and ETH ETF inflow data.",
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
      console.error("ETF_INFLOW error:", err);
      return false;
    }
  },
  examples: [],
};
