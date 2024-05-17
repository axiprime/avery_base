import parseCommand from '../parsing.js';

export const name = 'message';
export const execute = async (client, data) => {
    const messageBuffer = Buffer.from(data.data).toString().trimEnd()
    const ircRawMessages = messageBuffer.split('\r\n')
    ircRawMessages.forEach(async (ircRawMessage) => {
        const pM = parseCommand(ircRawMessage);
        if (!pM)
            return console.error('Unable to parse the message : ', ircRawMessage);
        switch (pM.command) {
            // client is the standard PART message that you receive when a user leaves a chat room.
            case 'JOIN':
                client.emit('JOIN', pM);
                break;
            // client is the standard PART message that you receive when a user leaves a chat room.
            case 'PART':
                client.emit('PART', pM);
                break;
            case 'PING':
                client.emit('PING', pM);
                break;
            case 'PONG':
                client.emit('PONG', pM);
                break;
            // Sent when the bot or moderator removes all messages from the chat room or removes all messages for the specified user.
            case 'CLEARCHAT':
                client.emit('CLEARCHAT', pM);
                break;
            // Sent when the bot removes a single message from the chat room.
            case 'CLEARMSG':
                client.emit('CLEARMSG', pM);
                break;
            // Sent when the bot authenticates with the server.
            case 'GLOBALUSERSTATE':
                client.emit('GLOBALUSERSTATE', pM);
                break;
            // Sent when a channel starts or stops hosting viewers from another channel.
            case 'HOSTTARGET':
                client.emit('HOSTTARGET', pM);
                break;
            // Sent to indicate the outcome of an action like banning a user.
            case 'NOTICE':
                client.emit('NOTICE', pM);
                break;
            case 'RECONNECT':
                client.emit('RECONNECT', pM);
                break;
            // Sent when a user posts a message to the chat room.
            case 'PRIVMSG':
                client.emit('PRIVMSG', pM);
                break;
            // Sent when the bot joins a channel or when the channel’s chat room settings change.
            case 'ROOMSTATE':
                client.emit('ROOMSTATE', pM);
                break;
            // Sent when events like someone subscribing to the channel occurs.
            case 'USERNOTICE':
                client.emit('USERNOTICE', pM);
                break;
            // Sent when the bot joins a channel or sends a PRIVMSG message. 
            case 'USERSTATE':
                client.emit('USERSTATE', pM);
                break;
            // Sent when someone sends your bot a whisper message. 
            case 'WHISPER':
                client.emit('WHISPER', pM);
                break;
            // client is the standard response for successful * ACK.
            case 'CAP':
                client.emit('CAP', pM);
                break;
            // This is the standard response for successful connection.
            case '001':
                client.emit('001', pM)
                break;
            case '002': // 
                client.emit('002', pM);
                break;
            case '003': //
                client.emit('003', pM);
                break;
            case '004': // 
                client.emit('004', pM);
                break;
            case '353': // Known users in the chat room.
                client.emit('353', pM);
                break;
            case '366': // End of /NAMES list
                client.emit('366', pM);
                break;
            case '372': // You are in a maze of twisty passages, all alike.
                client.emit('372', pM);
                break;
            case '375': // <servername> <command> <username> <...>
                client.emit('375', pM);
                break;
            case '376': // <servername> <command> <username> <...>
                client.emit('376', pM);
                break;
            case '421': // Unknown command
                break;
            default:
                console.warn('Not handled : ', ircRawMessage.split(' '));
        }
    })
}