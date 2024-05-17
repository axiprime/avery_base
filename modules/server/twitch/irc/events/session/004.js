export const name = '004';
export const execute = async (client, command, channel, message) => {
    if (client.irc_Debug[command])
        console.info(`[${client.utils.getLocalDate()}](${command}) Twitch chat: ${channel} ${message}`);
}