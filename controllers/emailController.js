require('dotenv').config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const { 
    EMAIL_HOST = "sandbox.smtp.mailtrap.io", 
    EMAIL_USERNAME = "ff7565c66e1aba", 
    EMAIL_PASSWORD = "ae595da01d0990",
    EMAIL_PORT = 2525,
} = process.env;

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD
    }
});

router.post('/send', (req, res) => {
    try {
        transporter.sendMail(req.body, (err, info) => {
            if (err) {
                console.log(err);
                return res.json({ error: err });
            }
        
            return res.status(200).json({
                success: true,
                message: `Email sent: ${info.messageId}`,
            });
        });
    } catch (error) {
        console.log(error);
        const errorMessage = response.text();
        throw new Error(errorMessage);
    }
});

module.exports = router;