const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const userModelSchema = new Schema({

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    resetToken: {
        type: String,
        default: null
    },

    resetTokenExpires: {
        type: Date,
        default: null
    }
})

module.exports = mongoose.model('User', userModelSchema);