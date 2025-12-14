const express = require("express");
const userController = require("../controllers/userController");
const  { authenticateUser } = require("../config/auth")

const userRouter = express.Router()


userRouter.post('/signup', userController.registerUser);
userRouter.get('', userController.getAllUser);
userRouter.post('/login', userController.loginUser);
userRouter.post('/forgotPassword', userController.forgotPassword);
userRouter.post('/resetPassword', userController.resetPassword);
userRouter.get('/userProfile', authenticateUser, userController.getAuthUser);


module.exports = userRouter;