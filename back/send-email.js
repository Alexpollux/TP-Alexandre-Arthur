const {Resend} = require("resend");
require('dotenv').config();
// Il faut un fichier .env avec une variable qui s'appelle RESEND_API_KEY et a pour valeur la clé API pour resend
const renvoi = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, subject, html) {
    return await renvoi.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: to,
        subject: subject,
        html: html,
    });
}

module.exports = { sendEmail };