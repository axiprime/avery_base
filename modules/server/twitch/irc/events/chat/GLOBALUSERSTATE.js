export const name = 'GLOBALUSERSTATE';
export const execute = async (client, userstate, command, test) => {
    if (client.irc_Debug[command])
        console.info(`[${client.utils.getLocalDate()}][GLOBALUSERSTATE] : `,userstate)
}