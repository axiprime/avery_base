# Few basic exemples about OAuth2 for Twitch and Discord, Twitch IRC(Websocket) connection, Discord.js version 14.15.1 linked to a MySQL database.

# Make sure you have update the .env-exemple file to .env

> [!IMPORTANT]
> OAuth2 run with a express server that you will need to provide your ip and port in the .env file.
>  - Exemple [ SERVER_IP = "localhost" SERVER_PORT : "3000" ]

> [!IMPORTANT]
> ## Twitch services => You require to create and application via the developer platform : https://dev.twitch.tv/
> * OAuth2
>  - Set the redirection ( Exemple : http://localhost:3000/twitchcallback )
>  - Select Website Integration as the category.
>  - Select confidential as the client type.
>  - Update the TWITCH_CLIENT_ID in the .env file with the client identification from the application.
>  - Update the TWITCH_CLIENT_SECRET in the .env file with the client secret from the application.
>  - Then save
 
> [!IMPORTANT]
> ## Discord services => You require to create an application via their developers platform : https://discord.com/developers/applications
> * OAuth2
>  - Set redirects in tab OAuth2. ( Exemple : http://localhost:3000/discordcallback )
>  - Update the DISCORD_CLIENT_ID in the .env file with the client identification from the application.
>  - Update the DISCORD_CLIENT_SECRET in the .env file with the client secret from the application.
>  - Then save
> * Discord.js
>  - Retreive API token from tab Bot.
>  - Update the DISCORD_TOKEN in the .env file with the client secret from the application.
> * MySQL
>  - Update the MYSQL_... in the env file with the right credential from your database.
>   - For local usage, you can use a (MySql Community)[https://dev.mysql.com/downloads/mysql/] and (MySQL Workbench)[https://www.mysql.com/products/workbench/]

# Discord JS & Twitch IRC both have a on off switch from the config.json file.


