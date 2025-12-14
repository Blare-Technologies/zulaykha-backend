const express = require("express");
const paymentController = require("../controllers/paymentController");
const { authenticateUser } = require("../config/auth");

const paymentRouter = express.Router();


paymentRouter.post('/initialize', authenticateUser, paymentController.initializePayment);
paymentRouter.get('/verify', paymentController.verifyPayment);


module.exports = paymentRouter;