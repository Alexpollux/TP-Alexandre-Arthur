import express from "express";
import fs from 'fs';
import cors from 'cors';
import { sendEmail } from './send-email.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 1234;

import { scrapingUntappd} from "./scraping_untappd.js";

app.use(express.json());
app.use(cors());

const path_data_beers = 'back/data_beers.json';

app.get('/api/beers/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    fs.readFile(path_data_beers, (err, data) => {
        if (err) {
            res.status(500).send('Erreur lors de la lecture de la database');
            return;
        }
        const beers = JSON.parse(data);
        const beer = beers.find(b => b.id === id);
        if (beer) {
            res.json(beer);
        } else {
            res.status(404).send('Bière non trouvée');
        }
    });
});

app.get('/api/beers', (req, res) => {
    const {brewed_after, brewed_before} = req.query;
    fs.readFile(path_data_beers, (err, data) => {
        if (err) {
            res.status(500).send('Erreur lors de la lecture de la database');
            return;
        }

        let beers = JSON.parse(data);

        if (brewed_before && brewed_before.split('/').length === 2) {
            beers = beers.filter(beer => {
                if (beer.first_brewed && beer.first_brewed.split('/').length === 2) {
                    const beerDate = new Date(beer.first_brewed.split('/')[1], beer.first_brewed.split('/')[0] - 1);
                    const beforeDate = new Date(brewed_before.split('/')[1], brewed_before.split('/')[0] - 1);
                    return beerDate <= beforeDate;
                }
                return false;
            });
        }

        if (brewed_after && brewed_after.split('/').length === 2) {
            beers = beers.filter(beer => {
                if (beer.first_brewed && beer.first_brewed.split('/').length === 2) {
                    const beerDate = new Date(beer.first_brewed.split('/')[1], beer.first_brewed.split('/')[0] - 1);
                    const afterDate = new Date(brewed_after.split('/')[1], brewed_after.split('/')[0] - 1);
                    return beerDate >= afterDate;
                }
                return false;
            });
        }

        res.json(beers);
    });
});

app.post('/api/send-email', async (req, res) => {
    const { subject, html } = req.body;

    console.log(req.body)

    const { data, error } = await sendEmail("arthur.delaporte@eemi.com", subject, html);

    if (error) {
        console.error({ error });
        return res.status(500).send('Failed to send email');
    }

    console.log({ data });
    res.send('Email sent successfully');
});

app.post('/api/scraping', async (req, res) => {
    const login = true;
    const performance = true;

    const {email, search, filter, sort} = req.body;

    await scrapingUntappd(login, performance, email, search, filter, sort);

    await res.send('Succesfully !');
})

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});