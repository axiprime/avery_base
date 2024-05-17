# OAuth2 Examples for Twitch and Discord, Twitch IRC (WebSocket) Connection, Discord.js and MySQL

This repository provides basic examples of OAuth2 integration for Twitch and Discord, establishing a Twitch IRC (WebSocket) connection, and using Discord.js version 14.15.1 linked to a MySQL database.

## Setup Instructions

1. **Update the `.env-exemple` file to `.env`.**

2. **OAuth2 Server Configuration:**
   - The OAuth2 integration runs with an Express server. You need to provide your IP and port in the `.env` file.
   - Example:
     ```env
     SERVER_IP="localhost"
     SERVER_PORT="3000"
     ```

### Twitch Services

1. **Create an Application:**
   - Go to the [Twitch Developer Platform](https://dev.twitch.tv/) and create an application.

2. **OAuth2 Configuration:**
   - Set the redirection URL (Example: `http://localhost:3000/twitchcallback`).
   - Select "Website Integration" as the category.
   - Select "Confidential" as the client type.
   - Update the following in the `.env` file:
     ```env
     TWITCH_CLIENT_ID="your_client_id"
     TWITCH_CLIENT_SECRET="your_client_secret"
     ```

### Discord Services

1. **Create an Application:**
   - Go to the [Discord Developer Portal](https://discord.com/developers/applications) and create an application.

2. **OAuth2 Configuration:**
   - Set the redirects in the OAuth2 tab (Example: `http://localhost:3000/discordcallback`).
   - Update the following in the `.env` file:
     ```env
     DISCORD_CLIENT_ID="your_client_id"
     DISCORD_CLIENT_SECRET="your_client_secret"
     ```

3. **Discord.js Configuration:**
   - Retrieve the API token from the Bot tab.
   - Update the following in the `.env` file:
     ```env
     DISCORD_TOKEN="your_bot_token"
     ```

### MySQL Configuration

1. **Database Credentials:**
   - Update the following in the `.env` file with your MySQL database credentials:
     ```env
     MYSQL_HOST="your_mysql_host"
     MYSQL_PORT="your_mysql_port"
     MYSQL_USER="your_mysql_user"
     MYSQL_PASSWORD="your_mysql_password"
     MYSQL_DATABASE="your_mysql_database"
     ```

2. **Local Usage:**
   - You can use [MySQL Community](https://dev.mysql.com/downloads/mysql/) and [MySQL Workbench](https://www.mysql.com/products/workbench/) for local development.

## Configuration Switches

- Both Discord.js and Twitch IRC services have on/off switches in the `config.json` file.


