export const name = 'close';

export const execute = async (client, code, reason,test) => {
    const messageBuffer = Buffer.from(reason).toString();
    switch (code) {
        case 1000:
            console.info(`[${client.utils.getLocalDate()}][TWITCH WEBSOCKET] Connection closed normally : `, code, messageBuffer);
            break;
        case 1001:
        case 1005:
        case 1006: {
            console.log('ERROR : ', code)
            //console.error('Connection closed abnormally. Trying to reconnect...', messageBuffer)
            //client.limitation.connectivity.fail++
            //setTimeout(async () => {
            //    await client.initialize();
            //}, client.limitation.connectivity.fail * 2000);
            break;
        }
        default:
            console.warn('[TWITCH WEBSOCKET CLOSE] Unhandled ] : ', code, messageBuffer)
            break;
    }
} 