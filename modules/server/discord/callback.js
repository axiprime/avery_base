// discordCallback.js
import { Router } from 'express';
import axios from '../../axios.js';
import cookieParser from 'cookie-parser';

export default function discordCallback(service, credentials, api_endpoint) {
  return Router().use(cookieParser()).get('/discordcallback', async (req, res) => {
    const code = req.query.code;
    if (!code) return res.send('Bad request.');
    try {
      const response = await axios.post(
        `${api_endpoint}/oauth2/token`,
        {
          client_id: credentials.client_id,
          client_secret: credentials.client_secret,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: credentials.redirect_uri,
          scope: credentials.scope
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );
      switch (response.status) {
        case 200:
          // Set cookies for the OAuth tokens
          res.cookie('discordAccessToken', response.data.access_token, { httpOnly: true, sameSite: 'strict' });
          res.cookie('discordTokenType', response.data.token_type, { httpOnly: true, sameSite: 'strict' });
          res.cookie('discordRefreshToken', response.data.refresh_token, { httpOnly: true, sameSite: 'strict' });
          res.cookie('discordExpiresAt', Date.now() + (response.data.expires_in * 1000), { httpOnly: true, sameSite: 'strict' });
          res.cookie('discordScope', response.data.scope, { httpOnly: true, sameSite: 'strict' });
          return res.send('CONNECTED WITH OAUTH2');
        default:
          return res.send({
            error: response.data.error,
            message: response.data.message
          });
      }
    } catch (err) {
      console.error(err);
      return res.send('Internal Server Error');
    }
  });
}
