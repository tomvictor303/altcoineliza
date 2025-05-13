import { generateText, ModelClass, type Action, type IAgentRuntime, type Memory, type State } from "@elizaos/core";
import { CryptoCurrency, getCryptoCurrencyList, getHeuristMeshAgentResponse, getInflowDataFormatted, getTokenPriceFormatted } from "../utils/custom.ts";
import { HEURIST_AGENT_NAMES } from "../utils/constants.ts";

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
      
      const context = `Please tell me which HEURIST agent is suitable for the message.
                      List of HEURIST agents that we can use: ${HEURIST_AGENT_NAMES.join(',')}.
                      The message is: ${message.content.text}
                      Only respond with agent name, do not include any other text.
                      If you cannot find out among provided agent names, just reply with appropriate response.`;
      const agentName = await generateText({
        runtime,
        context,
        modelClass: ModelClass.SMALL,
        stop: ["\n"]
      });

      console.log(`HEURIST: agentName: `, agentName)      
      if (!HEURIST_AGENT_NAMES.includes(agentName)) {
        console.log(`agentName is not provided or invalid`)
        await callback({ text: agentName });
        return true;
      }
      
      const text = await getHeuristMeshAgentResponse(agentName, message.content.text);

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
