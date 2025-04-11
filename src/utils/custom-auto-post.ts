import { DiscordClient } from "@elizaos/client-discord";
import { AgentRuntime } from "@elizaos/core";
import { getInflowDataFormatted } from "./custom.ts";

export async function customAutoDiscordPost(runtime: AgentRuntime): Promise<void> {
    const target_channel_id = process.env.TARGET_CHANNEL_ID;
    if (!target_channel_id) {
        console.error(`TARGET_CHANNEL_ID is not set in env. DISCORD_AUTO_POST_FAILED`);
        return;
    }

    if ( !runtime?.clients?.length ) {
        console.error(`No clients are connected. DISCORD_AUTO_POST_FAILED`);
        return;
    }

    var discordClient: DiscordClient = null;
    for (const [key, client] of Object.entries(runtime.clients)) {
        if (client instanceof DiscordClient ) {
            discordClient = client;
        }
    }

    if (!discordClient) {
        console.error(`Not found DiscordClient in connected clients. DISCORD_AUTO_POST_FAILED`);
        return;
    }

    const client = discordClient.client;
    const channel: any = client.channels.cache.get(target_channel_id);
    if (channel) {
        const text = await getInflowDataFormatted();
        channel.send(text);
    } else {
        console.error('Channel not found! DISCORD_AUTO_POST_FAILED');
    }
}