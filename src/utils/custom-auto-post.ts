import { DiscordClient } from "@elizaos/client-discord";
import { AgentRuntime } from "@elizaos/core";

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
        console.log('key', key, 'client', client);
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
        channel.send('Hello, world!');
    } else {
        console.error('Channel not found! DISCORD_AUTO_POST_FAILED');
    }
}