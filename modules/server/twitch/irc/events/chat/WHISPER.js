export const name = 'WHISPER';
export const execute = async (client, userstate, command, channel, message) => {
    if (client.irc_Debug[command])
        console.info(`[${client.utils.getLocalDate()}][WHISPER] : Channel : ${channel} Message : ${message}, userstate : `, userstate);
}