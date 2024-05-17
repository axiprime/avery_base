export const name = 'CAP';
export const execute = async (client, command, isCapRequestEnabled) => {
    if (client.irc_Debug[command])
    console.info(`[${client.utils.getLocalDate()}](${command}) Twitch chat: ${isCapRequestEnabled}`);
};