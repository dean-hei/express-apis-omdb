require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const axios = require('axios');

// Sets EJS as the view engine
app.set('view engine', 'ejs');
// Specifies the location of the static assets folder
app.use(express.static('static'));
// Sets up body-parser for parsing form data
app.use(express.urlencoded({ extended: false }));
// Enables EJS Layouts middleware
app.use(ejsLayouts);

// Adds some logging to each request
app.use(require('morgan')('dev'));

// Routes
app.get('/', function(req, res) {
  res.render('index');
});

// GET results page
app.get('/results', function(req, res) {
  var qs = {
    params: {
      s: req.query.title,
      apikey: process.env.OMDB_API_KEY
    }
  }
  axios.get('https://www.omdbapi.com', qs)
    .then(function(response) {
      var results = response.data;
      console.log(response.data);
      res.render('results', {returnData: response.data, query: qs.params.s});
    }).catch(err => {
      console.log(err);
      res.send("ERROR");
    }).then( () => console.log("we made it boys"));
});

// GET single movie
app.get('/movies/:id', (req, res) => {
  res.render('details');
});

// The app.listen function returns a server handle
var server = app.listen(process.env.PORT || 3000, () => {console.log("🎻LISTENING🎻")});

// We can export this server to other servers like this
module.exports = server;
