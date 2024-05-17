export const name = 'ROOMSTATE';
export const execute = async (client, roomstate, command, channel) => {
    if (client.irc_Debug[command])
        console.info(`[${client.utils.getLocalDate()}][ROOMSTATE] : Channel : ${channel} Roomstate : `, roomstate);
}