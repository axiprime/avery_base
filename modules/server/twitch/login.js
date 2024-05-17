import { Router } from 'express';
import querystring from 'querystring';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';

export default function twitchLogin(serverInstance) {
    return Router().use(cookieParser()).get('/twitchlogin', async (req, res) => {
        // Valide any previous connection
        if (req.cookies) {
            const { twitchAccessToken, twitchTokenType, twitchRefreshToken, twitchExpiresAt, twitchScope } = req.cookies;
            if (twitchAccessToken) {
                if (parseInt(twitchExpiresAt) > Date.now()) {
                    // Validate the oauth token
                    const validateAccessToken = await serverInstance.validateOauthAccessToken(twitchAccessToken);
                    if (validateAccessToken) {
                        serverInstance.credentials_user.access_token = twitchAccessToken;
                        serverInstance.credentials_user.token_type = twitchTokenType;
                        serverInstance.credentials_user.expires_at = twitchExpiresAt;
                        serverInstance.credentials_user.refresh_token = twitchRefreshToken;
                        serverInstance.credentials_user.scope = twitchScope;
                        return res.send('RECONNECTED WITH OAUTH2');
                    }
                }
            }
        }
        // No valid token found, redirect to Twitch for authentication
        res.redirect('https://id.twitch.tv/oauth2/authorize?' +
            querystring.stringify({
                client_id: serverInstance.credentials.client_id,
                redirect_uri: serverInstance.credentials.redirect_uri,
                response_type: 'code',
                scope: serverInstance.credentials.scope,
                state: crypto.randomBytes(16).toString('hex'),
            })
        );
    });
}

