import { Router } from 'express';

export default function discordPing() {
    return Router().get('/ping', (req, res) => {
        res.status(200).send('PONG');
    });
}
