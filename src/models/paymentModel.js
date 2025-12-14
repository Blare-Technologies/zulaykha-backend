const mongoose = require("mongoose");

const Schema = mongoose.Schema


const paymentModelSchema = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    amount: { 
        type: Number, 
        required: true 
    },
    currency: { 
        type: String, 
        enum: ['NGN', 'USD'], 
        default: 'NGN' 
    },
    reference: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'success', 'failed'], 
        default: 'pending' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }

})

module.exports = mongoose.model('Payment', paymentModelSchema);