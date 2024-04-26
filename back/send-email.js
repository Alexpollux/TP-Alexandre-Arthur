import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Il faut un fichier .env avec une variable qui s'appelle RESEND_API_KEY et a pour valeur la clé API pour resend
// const renvoi = new Resend(process.env.RESEND_API_KEY);
const host = process.env.HOST;
const port = process.env.PORT;
const user = process.env.USER;
const mail = process.env.MAIL;
const password = process.env.PASS;

const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: true,
    auth: {
        user: mail,
        pass: password,
    },
});

export async function sendEmail(to, subject, html) {
    try {
        const info = await transporter.sendMail({
            from: `"${user}" <${mail}>`,
            to: to,
            subject: subject,
            html: html,
        });

        console.log("Message sent: %s", info.messageId);

        return { data: info, error: null };
    } catch (error) {
        console.error("Error sending email:", error);

        return { data: null, error: error };
    }
}