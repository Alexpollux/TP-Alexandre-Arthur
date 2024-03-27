const express = require("express");
const fs = require('fs');
const cors = require('cors');
const { Resend } = require('resend');

require('dotenv').config()

const app = express();
const port = 1234;

app.use(express.json());
app.use(cors());

// Il faut un fichier .env avec une variable qui s'appelle RESEND_API_KEY et a pour valeur la clé API pour resend
const renvoi = new Resend(process.env.RESEND_API_KEY);
const path_data_beers = 'back/data_beers.json';
const path_data_beers_backup = 'back/data_beers_backup.json';

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
    fs.readFile(path_data_beers, (err, data) => {
        if (err) {
            res.status(500).send('Erreur lors de la lecture de la database');
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.get('/api/reset-db', (req, res) => {
    fs.readFile(path_data_beers_backup, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send("Erreur lors de la lecture de la database de backup");
            return;
        }

        // Écriture (écrasement) du contenu dans le fichier de destination
        fs.writeFile(path_data_beers, data, 'utf8', (err) => {
            if (err) {
                res.status(500).send("Erreur lors de l'écriture dans la database");
                return;
            }

            res.send('La database a été reset avec succès');
        });
    });
})

app.post('/api/send-email', async (req, res) => {
    const { subject, html } = req.body;

    console.log(req.body)

    const { data, error } = await renvoi.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: ['arthur.delaporte@eemi.com'],
        subject: subject,
        html: '<strong>'+html+'</strong>',
    });

    if (error) {
        console.error({ error });
        return res.status(500).send('Failed to send email');
    }

    console.log({ data });
    res.send('Email sent successfully');
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});