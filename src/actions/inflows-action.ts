import type { Action, IAgentRuntime, Memory, State } from "@elizaos/core";
import { getInflowData } from "../utils/custom.ts";

export const etfInflow: Action = {
  name: "ETF_INFLOW",
  similes: [],
  description: "Gets the latest BTC and ETH ETF inflow data.",
  validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
    return true;
  },
  handler: async (runtime, message, state, options, callback) => {
    try {
      const inflow = await getInflowData();

      if (!inflow.btc || !inflow.eth) {
        if (callback) await callback({ text: "⚠️ Could not fetch ETF inflow data." });
        return false;
      }

      const content = {
        text: `
📊 **ETF Inflow Snapshot**

🟡 **BTC**
• Date: ${inflow.btc.date}
• Net Inflow: $${format(inflow.btc.totalNetInflow)}
• Assets: $${format(inflow.btc.totalNetAssets)}

🔵 **ETH**
• Date: ${inflow.eth.date}
• Net Inflow: $${format(inflow.eth.totalNetInflow)}
• Assets: $${format(inflow.eth.totalNetAssets)}
        `.trim(),
      };

      if (callback) {
        await callback(content);
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

function format(num: number): string {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
