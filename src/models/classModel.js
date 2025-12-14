const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const classModelSchema = new Schema({

    
    sFirstName: {
        type: String,
        required: true,
        minlength: 5
    },
    
    sLastName: {
        type: String,
        required: true,
        minlength: 5
    },
    
    className: {
        type: String,
        required: true,
        enum: [
            'BeginnersClass1',
            'BeginnersClass2',
            'BegineersClass3', 
            'Idaadiy',
            'KiddiesClass1',
            'KiddiesClass2',
            'KiddiesClass3',
            'FamilyClass',
            'PrivateClass',
            'TahfeedhClass'
        ]
    },

    dateOfBirth: {
        type: String,
        required: true,
        minlength: 5
    },

    pgFirstName: {
        type: String,
        required: true,
        minlength: 5
    },

    pgLastName: {
        type: String,
        required: true,
        minlength: 5
    },

    streetAddress: {
        type: String,
        required: true,
        minlength: 5
    },

    lga: {
        type: String,
        required: true,
        minlength: 2
    },

    state: {
        type: String,
        required: true,
        minlength: 2
    },

    phone: {
        type: String,
        required: true,
        minlength: 5
    },

    email: {
        type: String,
        required: true,
        minlength: 5
    },

    schedule: {
        type: String,
        required: true,
        minlength: 2
    },

    currency: {
        type: String,
        required: true,
        minlength: 2
    },

    fee: {
        type: Number,
        required: true
    }

})

module.exports = mongoose.model('Class', classModelSchema);