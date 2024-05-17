export const name = 'open';

export const execute = async (client,reason) => {
    const { access_token, login } = client.credentials_user;
    client.ws.send("CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands");
    client.ws.send(`PASS oauth:${access_token}`);
    client.ws.send(`NICK ${login}`)
} 