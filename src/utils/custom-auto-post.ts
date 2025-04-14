import { DiscordClient } from "@elizaos/client-discord";
import { AgentRuntime } from "@elizaos/core";
import { getInflowDataFormatted, getTokenPricesFormatted, sleep } from "./custom.ts";
import cron from "node-cron";

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
        scheduleAutoDiscordPost(runtime, channel);
    } else {
        console.error('Channel not found! DISCORD_AUTO_POST_FAILED');
    }
}

function scheduleAutoDiscordPost(runtime: AgentRuntime, channel: any) {
    const cronExpression = process.env.DISCORD_AUTO_POST_CRON;

    if (!cronExpression) {
        console.warn("DISCORD_AUTO_POST_CRON not set. Skipping auto post scheduling.");
        return;
    }

    const sendTokenPrices2Discord = async () => {
        const texts = await getTokenPricesFormatted();
        for (let i = 0;i < texts.length; i++) {
            channel.send(texts[i]);
            sleep(500);
        }
    }

    const test = async () => {
        if (process.env.IS_DEV !== "true") { return; }
        ////////////////////////////////////
        await sendTokenPrices2Discord();
    }
    test();

    // Validate and schedule
    try {
        cron.schedule(cronExpression, async() => {
            const text = await getInflowDataFormatted();
            channel.send(text);

            await sendTokenPrices2Discord();
        });
        console.log(`Auto post scheduled with cron: "${cronExpression}"`);
    } catch (err) {
        console.error("Invalid cron expression. DISCORD_AUTO_POST_FAILED", err);
    }
}