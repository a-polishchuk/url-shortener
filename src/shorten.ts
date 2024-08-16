import { Request, Response } from 'express';
import crypto from 'node:crypto';
import { cache } from './cache';
import { logger } from './logger';

export function shorten(req: Request, res: Response) {
    const { longUrl } = req.body;
    const hash = generateShortHash(longUrl);

    cache.set(hash, longUrl);

    const shortUrl = getShortUrl(req, hash);
    logger.info({
        longUrl,
        shortUrl,
    }, 'URL shortened');

    res.send({
        shortUrl,
    });
}

function getShortUrl(req: Request, id: string) {
    const host = req.get('host');
    return `${req.protocol}://${host}/short/${id}`;
}

function generateShortHash(url: string) {
    return crypto
        .createHash('sha256')
        .update(url)
        .digest('base64')
        .substring(1, 8); // TODO: do it the right way
}