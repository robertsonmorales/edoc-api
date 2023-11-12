require('dotenv').config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const { 
    ETHEREAL_HOST, 
    ETHEREAL_USERNAME, 
    ETHEREAL_PASSWORD,
    ETHEREAL_PORT
} = process.env;

const transporter = nodemailer.createTransport({
    host: ETHEREAL_HOST,
    port: ETHEREAL_PORT,
    auth: {
      user: ETHEREAL_USERNAME,
      pass: ETHEREAL_PASSWORD
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