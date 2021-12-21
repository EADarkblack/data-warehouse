const express  = require('express');
require('dotenv').config();
const app = express();
const region = require('./src/region');
const country = require('./src/country');
const user = require('./src/user');
const city = require('./src/city');
const helmet = require('helmet');
const cors = require('cors');

// Middlewares

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(helmet());
app.use(cors());

// Routes

app.use(user);
app.use(region);
app.use(country);
app.use(city)

// listen

app.listen(4000, () => {
    console.log(`App listening on port 4000!`);
});