const mongoose = require("mongoose")
const dotenv = require("dotenv");

dotenv.config()

const MONGO_DB_CONNECT_URL = process.env.MONGO_DB_URL

function ConnectToMongo() {
    mongoose.connect(MONGO_DB_CONNECT_URL)

    mongoose.connection.on('connected', () => {
        console.log('Connected successfully');
    })
    mongoose.connection.on('error', (err) => {
        console.log(err)
        console.log("An error occured")
    })
}

module.exports = { ConnectToMongo }