export const name = 'RECONNECT';
export const execute = async (client, args) => {
    if (client.irc_Debug[command])
        console.info(`[${client.utils.getLocalDate()}][RECONNECT] : `, args)
    // Reconect to the IRC service
    client.reconnectIrcService();
}