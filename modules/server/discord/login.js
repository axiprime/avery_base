import { Router } from 'express';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';

export default function discordLogin(service, credentials, api_endpoint) {
    return Router().use(cookieParser()).get('/discordlogin', async (req, res) => {
        if (req.cookies) {
            const { discordAccessToken, discordExpiresAt } = req.cookies;
            if (discordAccessToken) {
                if (parseInt(discordExpiresAt) > Date.now()) {
                    const validateAccessToken = await service.validateOauthAccessToken(discordAccessToken);
                    if (validateAccessToken)
                        return res.send('RECONNECTED WITH OAUTH2');
                }
            }
        }
        res.redirect(`${api_endpoint}/oauth2/authorize?` +
            querystring.stringify({
                response_type: 'code',
                client_id: credentials.client_id,
                scope: credentials.scope,
                redirect_uri: credentials.redirect_uri
            })
        );
    });
}

