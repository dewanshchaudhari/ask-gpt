import express from 'express';
import cors from 'cors';
import createError from 'http-errors';
import helmet from "helmet";

import morgan from 'morgan';
import { checkDb } from './middlewares/checkDb';
import { generate } from './utils/openAI';
import { addEmailToDb, decrementCredit, getResultsFromDb, getSuggestions, insertIntoDb } from './utils/queries';
import { getUserWhatsAppDetails } from './utils/whatsAppDetails';
import { auth } from './middlewares/auth';
// import { checkDb } from './utils';
const app = express();
app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(morgan('tiny'));
app.get('/', (_req, res, next) => {
    try {
        res.json({
            status: 'ok',
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
});
app.get('/user/:waId', async (req, res, next) => {
    try {
        const { waId } = req.params;
        const userDetails = await getUserWhatsAppDetails(waId);
        if (!userDetails) next('Authentication Failed');
        res.json(userDetails);
    } catch (error) {
        next(error);
    }
});
app.get('/result/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await getResultsFromDb(parseInt(id));
        res.json(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
});
app.post('/results/:waId', auth, checkDb, async (req, res, next) => {
    let results = '';
    const { subject, lang, age, type } = req.body;
    console.log('/results/waId');
    const response = await generate(subject, lang, age, type);
    const data = response;
    if (!data) {
        next('Data not found');
        return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        results += chunkValue;
    }
    if (!results) next('Empty Results');
    const result = await insertIntoDb(results, subject, lang, age, type);
    //@ts-ignore
    await decrementCredit(req['phone']);
    if (!result) next('Error in db');

    res.json(result);
});
app.get('/query', async (req, res, next) => {
    try {
        const { query } = req.query;
        const results = await getSuggestions(query);
        if (!results) res.json([]);
        const suggestions = results?.map(e => e.subject);
        res.json(suggestions);
    } catch (error) {
        console.log(error);
        next(error);
    }
});
app.post('/email', async (req, res, next) => {
    try {
        const { email } = req.body;
        await addEmailToDb(email);
        res.json({
            message: "ok"
        })
    } catch (error) {
        next(error);
    }
});
app.use((req, _res, next) => {
    next(createError.NotFound(`🔍 - Not Found - ${req.originalUrl}`));
});
app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.status || 500);
    res.json({
        error: {
            status: err.status || 500,
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
        },
    });
});
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}/`));
