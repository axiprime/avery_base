export const name = '366';
export const execute = async (client,command,channel,userstate) => {
    if (client.irc_Debug[command])
    console.info(`[${client.utils.getLocalDate()}](${command}) Twitch chat: ${channel}`, userstate);
}