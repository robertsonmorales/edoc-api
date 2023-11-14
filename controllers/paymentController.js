require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const router = express.Router();

const { 
    PAYPAL_CLIENT_ID, 
    PAYPAL_CLIENT_SECRET, 
    ENDPOINT_URL
} = process.env;

const generateAccessToken = async () => {
    try {
        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
            throw new Error("MISSING_API_CREDENTIALS");
        }

        const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET).toString("base64");
        const response = await fetch(`${ENDPOINT_URL}/v1/oauth2/token`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${auth}`
            },
            body: 'grant_type=client_credentials'
        });

        const data = await response.json();
        return data.access_token;

    }catch (err) {
        throw new Error("Failed to generate Access Token:", err);
    }
}

const createOrder = async (order) => {
    const access_token = await generateAccessToken();
    const url = `${ENDPOINT_URL}/v2/checkout/orders`;

    const payload = order;
    // {
    //     intent: "CAPTURE",
    //     purchase_units: [{
    //         amount: {
    //             currency_code: 'USD',
    //             value: "100.00"
    //         }
    //     }]
    // }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
            'PayPay-Request-Id': uuidv4()
        },
        body: JSON.stringify(payload)
    });

    return handleResponse(response);
}

const captureOrder = async (orderID) => {
    const access_token = await generateAccessToken();
    const url = `${ENDPOINT_URL}/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
            'PayPay-Request-Id': uuidv4(),
            Authorization: `Bearer ${access_token}`
        }
    });

    return handleResponse(response);
}

async function handleResponse(response){
    try {
        const jsonResponse = await response.json();

        return {
            jsonResponse,
            httpStatusCode: response.status,
        };
    } catch (error) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
}

router.post('/orders', async (req, res) => {
    try {
        const { order } = req.body;
        const { jsonResponse, httpStatusCode } = await createOrder(order);
        res.status(httpStatusCode).json(jsonResponse);

    } catch (err) {
        res.status(500).json({ err: "Failed to create order." });
    }
});

router.post('/orders/:orderID/capture', async (req, res) => {
    try {
        const { orderID } = req.params;
        const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
        res.status(httpStatusCode).json(jsonResponse);

    } catch (err) {
        res.status(500).json({ err: "Failed to capture order." });
    }
});

module.exports = router;