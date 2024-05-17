export const name = 'NOTICE';
export const execute = async (client, userstate, command, channel, message) => {
    if (client.irc_Debug[command])
        console.info(`[${client.utils.getLocalDate()}][NOTICE] `, userstate, command, channel, message)
}