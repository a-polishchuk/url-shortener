import express, { Response } from "express";
import dotenv from "dotenv";
import { shorten } from "./shorten";
import { short } from "./short";
import { logger } from "./logger";

const config = dotenv.config();
logger.info(config.parsed, 'dotenv config parsed');

const app = express();
app.disable('x-powered-by');

app.use(express.json());
app.use((req, _res, next) => {
    logger.info(`requested ${req.path}`);
    next();
});

app.get('/', (_req, res) => {
    res.send("Welcome to URL shortener!");
});
app.post('/shorten', shorten);
app.get('/short/:id', short);

app.use((_req, res, _next) => {
    res.status(404).sendFile('404.gif', { root: './static' }, (err) => {
        if (err) {
            logger.error(err, "send file error");
        }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    logger.info(`server started on port ${PORT}`);
});
