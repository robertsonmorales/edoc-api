require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PORT = 3000 } = process.env;
const app = express();

const paymentController = require('./controllers/paymentController');
const emailController = require('./controllers/emailController');

const corsOptions = {
    origin: ['http://localhost:8080', 'http://wosdc.infinityfreeapp.com', 'https://wosdc.infinityfreeapp.com'],
    methods: ['GET', 'POST']
};

app.use(cors(corsOptions));

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