import { Request, Response } from 'express'
import { cache } from './cache';

export function short(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
        res.status(404).send('Page not found');
        return;
    }

    // TODO: get it from DB instead of 
    const longUrl = cache.get(id);
    if (!longUrl) {
        res.status(400).send("Such short URL doesn't exist");
        return;
    }

    // permanently redirect to the new url
    // we can actually use 302 (temporary redirect) as well
    // this will give us more freedom
    // but it's less performant
    res.redirect(301, longUrl);
}