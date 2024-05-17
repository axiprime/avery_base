export const name = 'PRIVMSG';
export const execute = async (client, userstate, command, channel, message) => {
    if (client.irc_Debug[command])
        console.info(`[${client.utils.getLocalDate()}][PRIVMSG] By: ${userstate.displayName}, Channel: ${channel}, Message: ${message}`,);
}