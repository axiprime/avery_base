export const name = "001";
export const execute = async (client, command, channel, message) => {
  if (client.irc_Debug[command])
    console.info(
      `[${client.utils.getLocalDate()}](${command}) Connected to Twitch chat: ${channel} ${message}`
    );
    // Join the chat room
    for (const channel of client.credentials_user.rooms)
      client.ws.send(`JOIN #${channel}`);
    
};
