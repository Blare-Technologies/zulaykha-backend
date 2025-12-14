const userModel = require("../models/userModel");
const validation = require("../config/validation");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const uuid = require("uuid")

dotenv.config()

const secretKey = process.env.SECRET_KEY



// register newUser
const registerUser = async function(req, res) {

    const valid = validation.ValidateUserData(req.body)

    if (valid.error) {
        return res.status(400).json({
            error: valid.error.details.map(detail => detail.message) })
    }

    const { firstName, lastName, email, password } = req.body;

    let existingUser;
    
    try {

        existingUser = await userModel.findOne({email});

        if (existingUser) {
            return res.status(400).json({message: "User with the provided email already exists. Login instead"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new userModel({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        await user.save();

        return res.status(201).json({message: "User register successfully"});

    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Server error"})
    }
}


const loginUser = async function (req, res) {

    const valid = validation.ValidateLoginData(req.body)

    if (valid.error) {
        return res.status(400).json({
            error: valid.error.details.map(detail => detail.message)
        })
    }

    const { email, password } = req.body;

    let existingUser;

    try {
        
        existingUser = await userModel.findOne({email})

        if (!existingUser) {
            return res.status(400).json({message: "No user found by this email. Signup"})
        }

        const comparePassword = await bcrypt.compare(password, existingUser.password);

        if (!comparePassword) {
            return res.status(400).json({message: "Incorrect password or email provided"});
        }

        const token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, secretKey , { expiresIn: '1h' });

        return res.status(200).json({
            message: "Login Successfully",
            token,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Server error"})
    }
}

const getAllUser = async function (req, res) {
    
    let users;

    try {

        users = await userModel
            .find({})
            .select("-password -resetToken -resetTokenExpires")

        if (!users || users.length === 0) {
            return res.status(404).json({message: "No user found"})
        }

        return res.status(200).json({users})

    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Server error"})
    }
}


async function forgotPassword(req, res) {

    
    const valid = validation.ValidateForgotData(req.body)
    
    if (valid.error) {
        return res.status(400).json({
            error: valid.error.details.map(detail => detail.message)
        })
    }

    const { email } = req.body;

    try {

        const existingUser = await userModel.findOne({ email })

        if (!existingUser) {
            return res.status(404).json({ error: "No user found by this email!" })
        }

        if (existingUser) {
            const token = uuid.v4();
            existingUser.resetToken = token;
            existingUser.resetTokenExpires = Date.now() + 3600000;
            const data = await existingUser.save();

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD

                }
            })

            const mailOptions = {
                from: process.env.EMAIL,
                to: existingUser.email,
                // subject: 'Password Reset Request',
                // text: `Click on the following link to reset your password: https://zga-website.vercel.app/auth/resetPassword?token=${token}`
                subject: `${existingUser.firstName}, Reset Your Password for Your Account`,
                html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                  <h2>Password Reset</h2>
                  <p>Hello, ${existingUser.firstName}</p>
                  <p>You have requested to reset your password. Click on the button below to proceed:</p>
                  <a href="https://zga-website.vercel.app/auth/resetPassword?token=${token}" 
                     style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
                     Reset Password
                  </a>
                  <p>If you did not request a password reset, please ignore this email.</p>
                  <p>Thank you,<br>The Zulaykha Global Academy</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;">
                </div>
            `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Failed to send password reset email" });
                }
                return res.status(200).json({ message: 'Password reset email sent successfully' });
            });
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Server error"})
    }
}


async function resetPassword(req, res, next) {

    
    const valid = validation.ValidateResetData(req.body)
    
    if (valid.error) {
        return res.status(400).json({
            error: valid.error.details.map(detail => detail.message)})
    }
    
    const { token, newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ error: "Password is required" });
    }
    try {
        const existingUser = await userModel.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: Date.now() }
        });

        if (!existingUser) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        existingUser.password = hashedPassword;
        existingUser.resetToken = undefined;
        existingUser.resetTokenExpires = undefined;

        const savedUser = await existingUser.save();

        if (savedUser) {
            return res.status(200).json({ message: 'Password reset successful' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong, please try again" });
    }
}


// Get Authenticated user profile
async function getAuthUser(req, res) {

    let userId = req.user.userId;

    if (!userId) {
        return res.status(403).json({message: "No authorization provided"})
    }

    try {

        const user = await userModel.findOne({_id: userId})

        if (!user) {
            return res.status(404).json({message: "No user found"})
        }

        return res.status(200).json({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Server error"})
    }
}



module.exports = {

    registerUser,
    getAllUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getAuthUser
}