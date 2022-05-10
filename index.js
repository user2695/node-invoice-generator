const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const homeRoutes = require('./routes/home-routes');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.static('public'));


app.use('/docs', express.static(path.join(__dirname, 'docs')));

app.use(homeRoutes.routes);


app.listen(3000, () => console.log('App is listening on url http://localhost:3000'));