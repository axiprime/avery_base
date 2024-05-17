import { Router } from 'express';
import axios from '../../axios.js';
import cookieParser from 'cookie-parser';

export default function spotifyCallback(serverInstance) {
  return Router().use(cookieParser()).get('/twitchcallback', async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    if (!state)
      return res.send("Mismatch state.")
    try {
      // Get the access token
      const response = await axios.post(
        `https://id.twitch.tv/oauth2/token`,
        {
          client_id: serverInstance.credentials.client_id,
          client_secret: serverInstance.credentials.client_secret,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: serverInstance.credentials.redirect_uri,
          scope: serverInstance.credentials.scope
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });

      switch (response.status) {
        case 200:
          serverInstance.credentials_user.access_token = response.data.access_token;
          serverInstance.credentials_user.token_type = response.data.token_type;
          serverInstance.credentials_user.expires_at = Date.now() + (response.data.expires_in * 1000);
          serverInstance.credentials_user.refresh_token = response.data.refresh_token;
          serverInstance.credentials_user.scope = response.data.scope;
          // Set cookies for the OAuth tokens
          res.cookie('twitchAccessToken', serverInstance.credentials_user.access_token, { httpOnly: true, sameSite: 'strict' });
          res.cookie('twitchTokenType', serverInstance.credentials_user.token_type, { httpOnly: true, sameSite: 'strict' });
          res.cookie('twitchRefreshToken', serverInstance.credentials_user.refresh_token, { httpOnly: true, sameSite: 'strict' });
          res.cookie('twitchExpiresAt', serverInstance.credentials_user.expires_at, { httpOnly: true, sameSite: 'strict' });
          res.cookie('twitchScope', serverInstance.credentials_user.scope, { httpOnly: true, sameSite: 'strict' });

          return res.send('CONNECTED WITH OAUTH2');
        case 400:
          return res.send({
            error: response.data.error,
            message: response.data.message
          });
        case 401:
          return res.send({
            error: response.data.error,
            message: response.data.message
          });
        case 403:
          return res.send({
            error: response.data.error,
            message: response.data.message
          });
        case 404:
          return res.send({
            error: response.data.error,
            message: response.data.message
          });
        default:
          return res.send('Internal Server Error');
      }
    } catch (err) {
      console.error(err);
      return res.send('Internal Server Error');
    }
  });
}
