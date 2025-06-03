import { generateText, ModelClass, type Action, type IAgentRuntime, type Memory, type State } from "@elizaos/core";
import { CryptoCurrency, getCryptoCurrencyList, getHeuristMeshAgentResponse, getInflowDataFormatted, getTokenPriceFormatted } from "../utils/custom.ts";
import { HEURIST_AGENT_NAMES } from "../utils/constants.ts";

export const heuristAction: Action = {
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

      let origin_text_of_inReplyTo = undefined;
      if ( message.content.inReplyTo ) {
        for (let i = 0; i < state.recentMessagesData.length; i++) {
          if ( state.recentMessagesData[i].id === message.content.inReplyTo ) {
            origin_text_of_inReplyTo = state.recentMessagesData[i].content.text
            console.log(`origin_text_of_inReplyTo`, origin_text_of_inReplyTo);
          }
        }
      }

      let prompt_msg = message.content.text;
      if (origin_text_of_inReplyTo) {
        prompt_msg = `${origin_text_of_inReplyTo}

                  ${message.content.text}`;
      }
      // remove user mentioning in prompt
      prompt_msg = prompt_msg.replace(/<@!?(\d+)>/g, '').replace(/\s+/g, ' ').trim();
      
      let context = `Please tell me which HEURIST agent is suitable for the message.
                      List of HEURIST agents that we can use: ${HEURIST_AGENT_NAMES.join(',')}.
                      If message provides non-solana wallet address, do not select SolWalletAgent.
                      Only respond with agent name, do not include any other text.
                      If you cannot find out among provided agent names, just reply with appropriate response.

                      (BEGIN of message)
                      ${prompt_msg}
                      (END of message)
                      `;

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
