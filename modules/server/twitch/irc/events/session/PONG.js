export const name = 'PONG';
export const execute = async (client, command,message) => {
    if (client.irc_Debug[command])
    console.info(`[${client.utils.getLocalDate()}][WS PONG]`);
}