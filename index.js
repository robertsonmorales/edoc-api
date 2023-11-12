require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PORT = 3000 } = process.env;
const app = express();

const paymentController = require('./controllers/paymentController');
const emailController = require('./controllers/emailController');

// console.log(emailController instanceof express.Router);

cors.apply(app, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST']
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/payment', paymentController);
app.use('/email', emailController);

app.get("/", (req, res) => {
    res.json({
        message: 'Hello, world!'
    })
});

app.listen(PORT, () => {
    console.log(`Node server listening at http://localhost:${PORT}/`);
});

module.exports = app;