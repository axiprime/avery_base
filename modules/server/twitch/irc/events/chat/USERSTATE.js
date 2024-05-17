export const name = 'USERSTATE';
export const execute = async (client, userstate, command, channel) => {
    if (client.irc_Debug[command])
        console.info(`[${client.utils.getLocalDate()}][USERSTATE] : Channel : ${channel} userstate : `, userstate);

}