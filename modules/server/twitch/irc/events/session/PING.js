export const name = 'PING';
export const execute = async (client, command, message) => {
    client.ws.send(`PONG ${message}`);
    if (client.irc_Debug[command])
        console.info(`[${client.utils.getLocalDate()}][PING]`);
}