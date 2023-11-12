require('dotenv').config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const { 
    EMAIL_HOST, 
    EMAIL_USERNAME, 
    EMAIL_PASSWORD,
    EMAIL_PORT,
    ENABLE_TLS
} = process.env;

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: ENABLE_TLS, // 
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
                message: `Email sent: ${info.messageId}`
            });
        });
    } catch (error) {
        console.log(error);
        const errorMessage = response.text();
        throw new Error(errorMessage);
    }
});

module.exports = router;