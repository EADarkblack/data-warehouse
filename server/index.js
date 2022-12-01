//Dependencies

const express = require('express');
require('dotenv').config();
const app = express();
const region = require('./src/region');
const country = require('./src/country');
const user = require('./src/user');
const city = require('./src/city');
const company = require('./src/company');
const helmet = require('helmet');
const contact = require('./src/contact');
const cors = require('cors');

// Middlewares

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(helmet());
app.use(cors());

// Routes

app.use(company);
app.use(user);
app.use(region);
app.use(country);
app.use(city);
app.use(contact);

// listen

app.listen(4000, () => {
    console.log(`App listening on port 4000!`);
});