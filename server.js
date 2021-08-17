//this is the main code linking all of the routers to the server
//if the app is in production it uses the information in the .env file
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
};

//imports all of the required libraries
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

//imports all of the routers
const indexRouter = require('./routes/index');
const normyRouter = require('./routes/normy');
const adminRouter = require('./routes/admin');

//allows for ejs to be used instead of html
app.set('view engine', 'ejs');
//tells the app where the ejs files are located
app.set('views', __dirname + '/views');
//allows for the use of a layout file to act as a duplicate instead of using php
app.set('layout', 'layouts/layout');
app.use(expressLayouts);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//sets up mongoose and specifies where the database will be 
//if it is in production it will be local, if it is not it will be in the cloud. 
const mongoose = require('mongoose');
const { response } = require('express');
mongoose.connect(process.env.DATABASE_URL, { 
    useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Database'));

//use the routers for each specific link
app.use('/', indexRouter);
app.use('/normy', normyRouter);
app.use('/admin', adminRouter);



//listens on either the port whatever is hosting it specifies or locally on port 3000
app.listen(process.env.PORT || 3000);