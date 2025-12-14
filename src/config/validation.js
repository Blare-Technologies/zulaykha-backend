const Joi = require("joi");

const ValidateUserData = (user) => {

    const userSchema = Joi.object({
        firstName: Joi.string().required().min(5),
        lastName: Joi.string().required().min(5),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required() // One digit, One lowercase, one Uppercase and minimum 8 char
    });

    return userSchema.validate(user);

}

const ValidateLoginData = (login) => {

    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required()
    });

    return loginSchema.validate(login)
}

const ValidateForgotData = (data) => {

    const forgotPasswordSchema = Joi.object({
        email: Joi.string().email().required()
    })
    
    return forgotPasswordSchema.validate(data)
}

const ValidateResetData = (data) => {

    const resetPasswordSchema = Joi.object({
        token: Joi.string().required(),
        newPassword: Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required()
    });

    return resetPasswordSchema.validate(data)
}


module.exports = {
    
    ValidateUserData,
    ValidateLoginData,
    ValidateForgotData,
    ValidateResetData

}