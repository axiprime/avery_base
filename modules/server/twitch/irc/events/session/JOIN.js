export const name = 'JOIN';
export const execute = async (client, userstate, command, channel, self) => {
    if(client.irc_Debug[command])
    if (self)
        console.info(`[${client.utils.getLocalDate()}][JOIN] Joined channel ${channel}`);
    else 
        console.info(`[${client.utils.getLocalDate()}][JOIN] User ${userstate.username} - joined channel ${channel}`);
     
}