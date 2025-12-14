const Payment = require("../models/paymentModel");
const axios = require("axios")


const initializePayment = async function(req, res) {

    const { className, amount, email, currency } = req.body;

    try {

        const userId = req.user.userId;

        const reference = `${Date.now()}_${userId}`;

        const payment = Payment.create({

            userId,
            className,
            amount,
            currency,
            reference: reference,
            status: 'pending'
        })

        // Paystack payload
        const payload = {
            email,
            amount: amount * 100, // Convert to kobo/cents
            currency,
            reference,
            callback_url: 'http://localhost:3000/api/v1/paystack/callback',
        };

        const config = {
            headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
            },
        };

        // Make request to Paystack API
        const response = await axios.post(
            `${process.env.PAYSTACK_BASE_URL}/transaction/initialize`,
            payload,
            config
        )

        res.status(200).json({ message: response.data.data });

    } catch(error) {
        console.log(error);
        return res.status(500).json({"message": "Failed to initialize transaction"})
    }

}


const verifyPayment = async function(req, res) {

    const { reference } = req.query;

    try{

        const config = {
            headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
            },
        };
        
        // Make request to Paystack API to verify payment
        const response = await axios.get(
            `${process.env.PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
            config
        )

        const data = response.data.data;

        const payment = await Payment.findOne({reference: reference})

        if (!payment) {
            return res.status(404),json({"message": "No payment found by this reference"})
        }

        // Update payment status
        payment.status = data.status === 'success' ? 'success' : 'failed';
        await payment.save();

        res.status(200).json({ message: `Payment ${data.status}`, payment });

    } catch (error) {
        console.log(error)
        return res.status(500).json({"message": "Failed to verify payment"})
    }
}



module.exports = {
    initializePayment,
    verifyPayment
}