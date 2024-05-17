export const name = '353';
export const execute = async (client, command, channel, users) => {
    if (client.irc_Debug[command])
        console.info(`[${client.utils.getLocalDate()}](${command}) Twitch chat: ${channel} `, users);
}