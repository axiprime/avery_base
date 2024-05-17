export const name = 'PART';
export const execute = async (client, userstate, command, channel, self) => {
    if (client.irc_Debug[command])
        if (self)
            console.info(`[${client.utils.getLocalDate()}][PART] Disconnected from channel ${channel}`);
        else
            console.info(`[${client.utils.getLocalDate()}][PART] User ${userstate.username} leaved channel ${channel}`);
}