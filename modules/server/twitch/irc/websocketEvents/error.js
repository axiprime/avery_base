export const name = 'error';

export const execute = async (client, error) => {
    const messageBuffer = Buffer.from(reason.reason).toString()
    switch (error.code) {
        case 'ECONNREFUSED':
            console.error(`[${client.utils.getLocalDate()}][TWITCH WEBSOCKET] Connection refused : ${error.code}`, messageBuffer);
            break;
        case 'ECONNRESET':
            console.error(`[${client.utils.getLocalDate()}][TWITCH WEBSOCKET] Connection reset : ${error.code}`, messageBuffer);
            break;
        case 'ENOTFOUND':
            console.error(`[${client.utils.getLocalDate()}][TWITCH WEBSOCKET] Connection not found : ${error.code}`, messageBuffer);
            break;
        case 'ETIMEDOUT':
            console.error(`[${client.utils.getLocalDate()}][TWITCH WEBSOCKET] Connection timeout : ${error.code}`, messageBuffer);
            break;
        default:
            console.error(`[${client.utils.getLocalDate()}][TWITCH WEBSOCKET] Unhandled error : ${error.code}`, messageBuffer);
            break;
    }
    client.destroy_services()
}