const convertKeys = function (originalKeys, command) {

    switch (command) {
        case 'CLEARCHAT': {
            const keyMappings = {
                'room-id': 'roomId',
                'tmi-sent-ts': 'tmiTimestamp'
            };
            return keyMappings[originalKeys] || originalKeys;
        }
        case 'CLEARMSG': {
            const keyMappings = {
                'login': 'login',
                'room-id': 'roomId',
                'tmi-sent-ts': 'tmiTimestamp',
                'target-msg-id': 'targetMsgId'
            };
            return keyMappings[originalKeys] || originalKeys;
        }
        case 'HOSTTARGET': {
            const keyMappings = {
                '-': '-',
                'channel': 'channel',
                'hosting-channel': 'hostingChannel',
                'number-of-viewers	': 'numberOfViewers',
            };
            return keyMappings[originalKeys] || originalKeys;
        }
        case 'NOTICE': {
            const keyMappings = {
                'msg-id': 'msgId',
            };
            return keyMappings[originalKeys] || originalKeys;
        }
        case 'PRIVMSG': {
            const keyMappings = {
                'badge-info': 'badgeInfo',
                'badges': 'badges',
                'client-nonce': 'clientNonce',
                'color': 'color',
                'display-name': 'displayName',
                'emotes': 'emotes',
                'first-msg': 'firstMsg',
                'flags': 'flags',
                'id': 'id',
                'mod': 'mod',
                'returning-chatter': 'returningChatter',
                'room-id': 'roomId',
                'subscriber': 'subscriber',
                'tmi-sent-ts': 'tmiTimestamp',
                'turbo': 'turbo',
                'user-id': 'userId',
                'user-type': 'userType'
            };
            return keyMappings[originalKeys] || originalKeys;
        }
        case 'GLOBALUSERSTATE': {
            const keyMappings = {
                'badge-info': 'badgeInfo',
                'badges': 'badges',
                'color': 'color',
                'display-name': 'displayName',
                'emote-sets': 'emoteSets',
                'user-id': 'userId',
                'user-type': 'userType'
            };
            return keyMappings[originalKeys] || originalKeys;
        }
        case 'USERNOTICE': {
            const keyMappings = {
                'badge-info': 'badgeInfo',
                'badges': 'badges',
                'color': 'color',
                'display-name': 'displayName',
                'emote-sets': 'emoteSets',
                'id': 'id',
                'login': 'login',
                'mod': 'mod',
                'msg-id': 'msgId',
                'room-id': 'roomId',
                'subscriber': 'subscriber',
                'system-msg': 'systemMsg',
                'tmi-sent-ts': 'tmiTimestamp',
                'turbo': 'turbo',
                'user-id': 'userId',
                'user-type': 'userType'
            }
            return keyMappings[originalKeys] || originalKeys;
        }
        case 'USERSTATE': {
            const keyMappings = {
                'badge-info': 'badgeInfo',
                'badges': 'badges',
                'color': 'color',
                'display-name': 'displayName',
                'emote-sets': 'emoteSets',
                'mod': 'mod',
                'subscriber': 'subscriber',
                'user-type': 'userType'
            };
            return keyMappings[originalKeys] || originalKeys;
        }
        case 'ROOMSTATE': {
            const keyMappings = {
                'emote-only': 'emoteOnly',
                'followers-only': 'followersOnly',
                'r9k': 'r9k',
                'room-id': 'roomId',
                'slow': 'slow',
                'subs-only': 'subsOnly'
            };
            return keyMappings[originalKeys] || originalKeys;
        }
        case '366': {
            const keyMappings = {
                'badge-info': 'badgeInfo',
                'badges': 'badges',
                'color': 'color',
                'display-name': 'displayName',
                'emote-sets': 'emoteSets',
                'mod': 'mod',
                'subscriber': 'subscriber',
                'user-type': 'userType'
            };
            return keyMappings[originalKeys] || originalKeys;
        }
        default:
            console.log('Command not supported in parsing.js :', command);
    }
}

// Parses the parameters component of the IRC message. //////////////////////////////////////////
const parseIrcParameters = function (rawParametersComponent, command) {
    return Object.fromEntries(rawParametersComponent.split(';').map(item => {
        const [key, value] = item.split('=').map(str => str.trim());
        return [convertKeys(key, command), value || ''];
    }));
}

// Parses the command component of the IRC message. /////////////////////////////////////////////
const parseCommand = function (rawCommandComponent) {
    let commandParts = rawCommandComponent.split(' ');
    let parameters = null;

    // Supported IRC messages
    switch (commandParts[0]) {
        case 'PING':
            parameters = {
                command: commandParts[0],
                message: commandParts.slice(1).join(' ').slice(1)
            }
            break;
        case 'PONG':
            parameters = {
                command: commandParts[0],
                message: commandParts.slice(1).join(' ').slice(1)
            }
            break;
    }
    if (parameters)
        return parameters;
    // MEMBERSHIP COMMANDS
    switch (commandParts[1]) {
        case 'NOTICE': {
            parameters = {
                command: 'SERVERNOTICE',
                message: commandParts.slice(3).join(' ').slice(1)
            }
        }
            break;
        case 'JOIN': {
            parameters = {
                userstate: {
                    username: commandParts[0].slice(1).split('!')[0],
                },
                command: commandParts[1],
                channel: commandParts[2].slice(1),
                self: (commandParts[0].slice(1).split('!')[0] === commandParts[2].slice(1)) ? true : false
            }
        }
            break;
        case 'PART': {
            parameters = {
                userstate: {
                    username: commandParts[0].slice(1).split('!')[0],
                },
                command: commandParts[1],
                channel: commandParts[2].slice(1),
                self: (commandParts[0].slice(1).split('!')[0] === commandParts[2].slice(1)) ? true : false
            }
        }
            break;
        case 'CAP': {
            parameters = {
                command: commandParts[1],
                isCapRequestEnabled: (commandParts[2] === 'ACK') ? true : false,
            }
        }
            break;
        case '001': {
            parameters = {
                command: commandParts[1],
                channel: commandParts[2],
                message: commandParts.slice(3).join(' ').slice(1)
            }
        }
            break;
        case '002': {
            parameters = {
                command: commandParts[1],
                channel: commandParts[2],
                message: commandParts.slice(3).join(' ')
            }
        }
            break;
        case '003': {
            parameters = {
                command: commandParts[1],
                channel: commandParts[2],
                message: commandParts.slice(3).join(' ')
            }
        }
            break;
        case '004': {
            parameters = {
                command: commandParts[1],
                channel: commandParts[2],
                message: commandParts.slice(3).join(' ')
            }
        }
        break;
        case '353': {
            parameters = {
                command: commandParts[1],
                channel: commandParts[4],
                users: commandParts.slice(5).join(' ').slice(1).split(' ')
            }
        }
            break;
        case '366': {
            parameters = {
                command: commandParts[1],
                channel: commandParts[2],
                userstate: parseIrcParameters(commandParts[0].slice(1), '366'),
            }
        }
            break;
        case '372': {
            parameters = {
                command: commandParts[1],
                channel: commandParts[2],
                message: commandParts.slice(3).join(' ').slice(1)
            }
        }
            break;
        case '375': {
            parameters = {
                command: commandParts[1],
                channel: commandParts[2],
                message: commandParts.slice(3).join(' ').slice(1)
            }
        }
            break;
        case '376': {
            parameters = {
                command: commandParts[1],
                channel: commandParts[2],
                message: commandParts.slice(3).join(' ').slice(1)
            }
        }
            break;
        case '421':
            parameters = {
                command: commandParts[1],
                channel: commandParts[2],
                message: commandParts.slice(2).join(' ').slice(1)
            }
            break;
    }
    if (parameters)
        return parameters;
    // IRC COMMANDS
    switch (commandParts[2]) {
        case 'CLEARCHAT': {
            parameters = {
                roomstate: parseIrcParameters(commandParts[0].slice(1), 'CLEARCHAT'),
                command: commandParts[2],
                channel: commandParts[3].slice(1),
            }
        }
            break;
        case 'CLEARMSG': {
            parameters = {
                userstate: parseIrcParameters(commandParts[0].slice(1), 'CLEARMSG'),
                command: commandParts[2],
                channel: commandParts[3].slice(1),
                message: commandParts.slice(4).join(' ').slice(1)
            }
        }
            break;
        case 'GLOBALUSERSTATE': {
            parameters = {
                userstate: parseIrcParameters(commandParts[0].slice(1), 'GLOBALUSERSTATE'),
                command: commandParts[2],
            }
        }
            break;
        case 'HOSTTARGET': {
            parameters = {
                command: commandParts[0],
                channel: commandParts[1].slice(1),
                hostingChannel: commandParts[2],
                numberOfViewers: commandParts[3],
            }
        }
            break;
        case 'NOTICE': {
            parameters = {
                userstate: parseIrcParameters(commandParts[0].slice(1), 'NOTICE'),
                command: commandParts[2],
                channel: commandParts[3].slice(1),
                message: commandParts.slice(4).join(' ').slice(1)
            }
        }
            break;
        case 'ROOMSTATE': {
            parameters = {
                parameter: parseIrcParameters(commandParts[0].slice(1), 'ROOMSTATE'),
                command: commandParts[2],
                channel: commandParts[3].slice(1)
            }
        }
            break;
        case 'USERNOTICE': {
            parameters = {
                userstate: parseIrcParameters(commandParts[0].slice(1), 'USERNOTICE'),
                command: commandParts[2],
                channel: commandParts[3].slice(1),
            }
        }
            break;
        case 'USERSTATE': {
            parameters = {
                userstate: parseIrcParameters(commandParts[0].slice(1), 'USERSTATE'),
                command: commandParts[2],
                channel: commandParts[3].slice(1)
            }
        }
            break;
        case 'PRIVMSG': {
            parameters = {
                userstate: parseIrcParameters(commandParts[0].slice(1), 'PRIVMSG'),
                command: commandParts[2],
                channel: commandParts[3].slice(1),
                message: commandParts.slice(4).join(' ').slice(1)
            }
        }
            break;
        case 'WHISPER': {
            parameters = {
                userstate: parseIrcParameters(commandParts[0].slice(1), 'WHISPER'),
                command: commandParts[2],
                channel: commandParts[3].slice(1),
                message: commandParts.slice(4).join(' ').slice(1)
            }
        }
            break;
    }

    return parameters;

}

export default parseCommand