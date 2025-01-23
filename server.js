const express = require('express')
const mongoose = require('mongoose')
const morgan = require ('morgan')
const bodyParser = require('body-parser')

require('dotenv').config();


const app = express()

// Routes

const AuthRoute = require ('./routers/Auth')
const prodRoute = require('./routers/Product');
const suppRoute = require('./routers/Supp');
const saleRoute = require('./routers/Sale');
const CategoryRoutes = require ('./routers/Category')
const listRoute = require("./routers/Wishlist");
const cartRoutes = require('./routers/Cart'); 
const orderRoutes = require('./routers/Commande'); 


// Middleware
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use("/uploads/images", express.static("uploads/images"));


const cors = require('cors')
app.use(cors({origin: '*'}))

// MongoDB connection
mongoose
  .connect('mongodb://localhost:27017/HEALTH-SALADE', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));



app.use('/api', AuthRoute);
app.use('/api', prodRoute);
app.use('/api', suppRoute);
app.use('/api', saleRoute);
app.use('/api', CategoryRoutes);
app.use('/api', listRoute);
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error details
  res.status(500).send('Something went wrong!');
});




app.listen(process.env.PORT, ()=>{
  console.log(`server run on port ${process.env.PORT}`)
})
