// NODE MODULES
import express from "express";
import Websocket from "ws";
import EventEmitter from "events";
import dotenv from "dotenv";
// JSON CONFIG
import config from "../../config.json" assert { type: "json" };
// ENV CONFIG
import { inspect } from "util";
inspect.defaultOptions.depth = null;
// Parse ENV file as JSON
const env = dotenv.config({ path: `.env` }).parsed;
//////////////////////////////////////////////////////////
// Utils
import utils from "../utils.js";
// APP EVENTS
import ping from "./ping.js";
// APP SERVICES DISCORD
import discordLogin from "./discord/login.js";
import discordCallback from "./discord/callback.js";
import DiscordClient from "./discord/api/discord.js";
// APP SERVICES TWITCH
import twitchLogin from "./twitch/login.js";
import twitchCallback from "./twitch/callback.js";
import { ircTwitchtvents, ircWebsocketEvents } from "./twitch/irc/handlers.js";
import axios from "../axios.js";

// DISCORD SERVICE
class Discord {
  #app;
  #api_endpoint;
  #credentials;
  constructor(server) {
    // Express APP
    this.#app = server.app;
    this.#api_endpoint = config.discord.api_endpoint;
    this.#credentials = {
      client_id: env.DISCORD_CLIENT_ID,
      client_secret: env.DISCORD_CLIENT_SECRET,
      redirect_uri: `http://${env.SERVER_IP}:${env.SERVER_PORT}/${config.discord.callback}`,
      token: env.DISCORD_TOKEN,
      scope: config.discord.scope,
    };
    // Discord JS Client
    this.discordclient = new DiscordClient(env);
  }
  async init() {
    // INITIALIZE THE /discordlogin ROUTES
    this.#app.use("/", discordLogin(this, this.#credentials, this.#api_endpoint));
    // INITIALIZE THE /discordcallback ROUTES
    this.#app.use("/", discordCallback(this, this.#credentials, this.#api_endpoint));
    // INITIALIZE THE DISCORD CLIENT
    if (config.discord.DiscordJS)
      this.discordclient.start();
  }
  async validateOauthAccessToken(token) {
    const request = await axios.get('https://discord.com/api/v9/users/@me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    switch (request.status) {
      case 200:
        return true;
      case 401:
        return false;
      default:
        throw new Error('Unable to validate the oauth token : ', request);
    }
  }
  async disconnect() {
    await this.discordclient.exit();
  }
}
// TWITCH SERVICE
class Twitch extends EventEmitter {
  constructor(server) {
    super();
    // Express APP
    this.app = server.app;
    this.utils = new utils();
    // Twitch IRC Websocket
    this.ws = null;
    // Configs /////
    this.api_endpoint = config.twitch.api_endpoint;
    this.credentials = {
      client_id: env.TWITCH_CLIENT_ID,
      client_secret: env.TWITCH_CLIENT_SECRET,
      redirect_uri: `http://${env.SERVER_IP}:${env.SERVER_PORT}/${config.twitch.callback}`,
      scope: config.twitch.scope,
    };
    this.credentials_user = {
      // User login associated with the bot
      login: config.twitch.Irc_login,
      user_id: null,
      // Rooms that the bot will join
      rooms: config.twitch.Irc_rooms,
      access_token: null,
      token_type: null,
      expires_at: 0,
      refresh_token: null,
      scope: null,
    };
    this.irc_Websocket_InternalId = null;
    this.irc_Debug = config.twitch.Irc_Events_Debug;
  }
  async init() {
    // INITIALIZE THE /twitchlogin ROUTES
    this.app.use("/", twitchLogin(this));
    // INITIALIZE THE /twitchcallback ROUTES
    this.app.use("/", twitchCallback(this));
    // If the access token is not set wait for it to be set
    while (!this.credentials_user.access_token) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    // Connect to the IRC chat
    if (config.twitch.Irc_chat)
      this.connectIrcService();
  }
  // Validate the oauth token
  async validateOauthAccessToken(token) {
    const request = await axios.get('https://id.twitch.tv/oauth2/validate', {
      headers: { 'Authorization': `OAuth ${token}` }
    });
    switch (request.status) {
      case 200:
        return true;
      case 401:
        return false;
      default:
        throw new Error('Unable to validate the oauth token : ', request);
    }
  }
  // CONNECT IRC CHAT WEBSOCKET
  async connectIrcService() {
    console.info("[IRC] Connecting to twitch IRC chat websocket");
    await ircTwitchtvents(this);
    await ircWebsocketEvents(this);
    // Open the websocket connection to Twitch chat
    this.ws = new Websocket(`wss://${config.twitch.Irc_Host}:${config.twitch.Irc_Port}/`);

    this.ws.on("open", () => {
      this.emit("open", { data: "Reconnecting to Twitch chat" });
    });
    this.ws.on("error", async (error) => {
      this.emit("error", { error });
    });
    this.ws.on("close", async (code, reason) => {
      this.emit("close", { code, reason });
      clearInterval(this.irc_Websocket_InternalId);
    });
    this.ws.on("message", async (data) => {
      this.emit("message", { data });
    });
    // Ping local websocket to keep the connection active
    this.irc_Websocket_InternalId = setInterval(() => {
      if (this.ws.readyState === Websocket.OPEN) {
        this.ws.send("PING");
      }
    }, 30000);
  }
  // RECONNECT IRC CHAT WEBSOCKET
  async reconnectIrcService() {
    await this.disconnectIrcService();
    this.connectIrcService();
  }
  // DISCONNECT IRC CHAT WEBSOCKET
  async disconnectIrcService() {
    console.info("[IRC] Closing twitch IRC chat websocket");
    // If there active listeners
    if (this.listenerCount("open") > 0 || this.listenerCount("error") > 0 || this.listenerCount("close") > 0 || this.listenerCount("message") > 0)
      this.removeAllListeners();
    // Close the websocket connection if active
    if (this.ws)
      this.ws.close(1000);
    this.ws = null;
    // Clear the ping interval if active
    if (this.irc_Websocket_InternalId)
      clearInterval(this.irc_Websocket_InternalId);
  }
}
// EXPRESS SERVER
class Server extends utils {
  constructor() {
    super();
    this.ip = env.SERVER_IP;
    this.port = env.SERVER_PORT;
    this.app = null;
    this.Discord = null;
    this.Spotify = null;
    this.Twitch = null;
    if (!this.ip || !this.port) {
      throw new Error("Le ip et le port sont requis pour démarrer le serveur.");
    }
  }
  start() {
    // Initialize the server with express
    this.app = express();
    // Error handler
    this.app.use(function errorHandler(err, req, res, next) {
      res.status(400).send(err.message);
    });
    // Start the server listener
    this.server = this.app.listen(this.port, this.ip, () => {
      console.info(
        `[SERVER - EXPRESS] Running on http://${this.ip}:${this.port}`
      );
    });
    // Start the ping service for the server
    this.app.use("/", ping());
    // Initialize the Discord service
    if (env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET && env.DISCORD_TOKEN) {
      this.Discord = new Discord(this);
      this.Discord.init();
    } else {
      if (!env.DISCORD_CLIENT_ID)
        console.warn("[SERVER - EXPRESS] Discord client id is not set.");
      if (!env.DISCORD_CLIENT_SECRET)
        console.warn("[SERVER - EXPRESS] Discord client secret is not set.");
      if (!env.DISCORD_TOKEN)
        console.warn("[SERVER - EXPRESS] Discord token is not set.");
    }
    // Initialize the Spotify service
    if (env.SPOTIFY_CLIENT_ID && env.SPOTIFY_CLIENT_SECRET) {
      this.Spotify = new Spotify(this);
      this.Spotify.init();
    } else {
      if (!env.SPOTIFY_CLIENT_ID)
        console.warn("[SERVER - EXPRESS] Spotify client id is not set.");
      if (!env.SPOTIFY_CLIENT_SECRET)
        console.warn("[SERVER - EXPRESS] Spotify client secret is not set.");
    }
    // Initialize the Twitch service
    if (env.TWITCH_CLIENT_ID && env.TWITCH_CLIENT_SECRET) {
      this.Twitch = new Twitch(this);
      this.Twitch.init();
    } else {
      if (!env.TWITCH_CLIENT_ID)
        console.warn("[SERVER - EXPRESS] Twitch client id is not set.");
      if (!env.TWITCH_CLIENT_SECRET)
        console.warn("[SERVER - EXPRESS] Twitch client secret is not set.");
    }
    if (!this.Discord && !this.Spotify && !this.Twitch) {
      console.warn("[SERVER - EXPRESS] No services are enabled.");
    }
  }

  async close() {
    try {
      this.server.close();
      // Discord
      if (this.Discord)
        await this.Discord.disconnect();
      // Twitch
      if (this.Twitch && this.Twitch.ws)
        this.Twitch.disconnectIrcService();
    } catch (error) {
      console.error('[EXPRESS - CLOSE] Error : ', error);
    }
  }
}
const ServerExpress = (...args) => new Server(...args);
export default ServerExpress;
