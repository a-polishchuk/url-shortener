import express from "express";
import dotenv from "dotenv";
import { shorten } from "./shorten";
import { short } from "./short";

dotenv.config();

const app = express();
app.disable('x-powered-by');

// middleware function to parse JSON request body
app.use(express.json());

app.get('/', (_req, res) => {
    res.send("Welcome to URL shortener!");
});
app.post('/shorten', shorten);
app.get('/short/:id', short);

app.use((_req, res, _next) => {
    res.status(404).send("Page not found");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
