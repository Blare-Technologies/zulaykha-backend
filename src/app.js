const express = require('express');
const cors = require('cors');
const { ConnectToMongo } = require('./config/db');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const userRouter = require('./routes/userRoute');
const classRouter = require('./routes/classRoute');
const paymentRouter = require('./routes/paymentRoute');

dotenv.config()

const app = express()
const PORT = 8000 || process.env.PORT

// apply helmet
app.use(helmet())
app.use(express.json())

const corsOptions = {
    origin: [
    "https://zga-website.netlify.app/"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};
  
app.use(cors(corsOptions));
  
app.options("*", cors(corsOptions));

ConnectToMongo();



const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: "Too many requests from this IP, please try again later"
})

// apply rate limit to all routes
app.use(apiLimiter)


app.use('/auth', userRouter);
app.use('/api/v1', classRouter);
app.use('/api/v1', paymentRouter)


app.listen(PORT, ()=> {
    console.log(`Server is listening on port ${PORT}`);
})




walk me through deploying this app on vercel and check it out in the browser
