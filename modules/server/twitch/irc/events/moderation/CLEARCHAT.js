export const name = 'CLEARCHAT';
export const execute = async (client, roomstate, command, channel) => {
    if (client.irc_Debug[command])
        console.info(`[${client.utils.getLocalDate()}][CLEARCHAT] Chat cleared in channel ${channel}`);

}