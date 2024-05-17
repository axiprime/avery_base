import { Client, GatewayIntentBits, Partials, ActivityType } from 'discord.js';
import fs from 'fs';
import path from 'path';
import Database from "../../database/database.js";
import GuildsManager from './managers/guilds.js';

export default class DiscordClient extends Client {
    #config;
    constructor(config) {
        super({
            autoReconnect: true,
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.MessageContent,
            ],
            partials: [
                Partials.Message,
                Partials.Channel
            ],
            presence: { activities: [{ name: `DevBot`, type: ActivityType.Custom, state: 'Test services' }] }
        });
        this.#config = config;
        this.db = null;
        this.GM = new GuildsManager(this)
        this.startingTime = Date.now();
        this.botIsReady = false;
    }
    async start() {
        console.info('==== Connection to Database ====');
        this.db = await Database.connect(this.#config);
        console.info('===== Loading bot features =====');
        // Load Events
        await this.loadEvents();
        // Connect to Discord
        await this.login(this.#config.DISCORD_TOKEN);
        this.botIsReady = true;
    }
    async loadEvents() {
        const destination = path.dirname(process.argv[1]) + "/modules/server/discord/api/events"
        const eventFolders = fs.readdirSync(destination);
        const events = [];
        for (const folder of eventFolders) {
            const eventFiles = fs.readdirSync(`${destination}/${folder}`).filter((file) => file.endsWith(".js"));
            for (const file of eventFiles) {
                const command = await import(`${process.platform === "win32" ? "file://" : ""}${destination}/${folder}/${file}`);
                events.push({ folder: folder, file: file });
                if (command.once) {
                    this.once(command.name, (...args) => command.execute(...args, this));
                } else {
                    this.on(command.name, async (...args) => await command.execute(...args, this));
                }
            }
        }
        console.info(
            `==================== Loaded Discord Events ====================\n${events.map((e) => `${e.folder} => ${e.file}`).join("\n")}\n===============================================================\n`
        );
    }
    async exit() {
        await this.destroy();
    }
}