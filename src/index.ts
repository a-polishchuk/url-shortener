import express from "express";
import dotenv from "dotenv";
import { shorten } from "./shorten";
import { short } from "./short";
import { logger } from "./logger";

const config = dotenv.config();
logger.info(config.parsed, 'dotenv config parsed');

const app = express();
app.disable('x-powered-by');

// middleware function to parse JSON request body
app.use(express.json());

// middleware to log all request with timestamps
app.use((req, _res, next) => {
    logger.info(req.path, 'incoming request');
    next();
});

app.get('/', (_req, res) => {
    res.send("Welcome to URL shortener!");
});
app.post('/shorten', shorten);
app.get('/short/:id', short);

// all unmatched routes will be handled by this middleware
app.use((_req, res, _next) => {
    // TODO: return some funy static resource instead
    res.status(404).send("Page not found");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    logger.info(`server started on port ${PORT}`);
});
