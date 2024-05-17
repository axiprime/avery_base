export const name = 'USERNOTICE';
export const execute = async (client, userstate, command, channel) => {
    if (client.irc_Debug[command])
        console.info(`[${client.utils.getLocalDate()}][USERNOTICE] : Channel : ${channel} userstate : `, userstate);

}