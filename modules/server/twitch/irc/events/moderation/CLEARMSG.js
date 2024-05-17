export const name = 'CLEARMSG';
export const execute = async (client, userstate, command, channel, message) => {
    if (client.irc_Debug[command])
        console.info(`[${client.utils.getLocalDate()}][CLEARMSG] : Channel : ${channel} Message : ${message}, userstate : `, userstate)

}