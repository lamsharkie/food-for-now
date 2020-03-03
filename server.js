'use strict';

// Middleware and Dependencies
require('dotenv').config();

const express = require('express');
const app = express();
require('ejs');
const superagent = require('superagent');
const methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true,}));
app.use(express.static('./public'));
app.use(methodOverride('_method'));
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

const PORT = process.env.PORT || 3001;

// Routes
app.get('/', renderHomePage);
app.get('/recipeResults', renderRecipes);
app.get('/foodforlater', renderMyList);

// Functions
function renderHomePage(request, response){
  response.render('./index.ejs');
}

function renderRecipes(request, response){
  response.render('./results.ejs');
}

function renderMyList(request, response){
  response.render('./mylist.ejs');
}

function Recipe(obj){
  this.label = obj.label;
  this.image_url = obj.hits.recipe.image;
  this.dietLabels = obj.hits.recipe.dietLabels;
  this.ingredientLines = obj.hits.recipe.ingredientLines;
}

// Turn on the DB and the Server
client.connect()
  .then(
    app.listen(PORT, () => console.log(`listening on ${PORT}`))
  );
