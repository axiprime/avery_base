export const name = 'SERVERNOTICE';
export const execute = async (client, command, message) => {
    if (client.irc_Debug[command])
        console.info(`[${client.utils.getLocalDate()}][SERVERNOTICE] : `, message)
}