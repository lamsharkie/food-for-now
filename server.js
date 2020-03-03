'use strict';

// Middleware and Dependencies
require('dotenv').config();

const express = require('express');
const app = express();
require('ejs');
const superagent = require('superagent');
const methodOverride = require('method-override');

app.use(express.urlencoded({extended: true,}));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

const PORT = process.env.PORT || 3001;

// Routes
app.get('/', renderHomePage);
app.post('/search', handleSearch);
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

function handleSearch(request, response) {
  let searchTerm = request.body.search;
  let url = `https://api.edamam.com/search?q=${searchTerm}&app_id=${process.env.EDAMAM_ID}&app_key=${process.env.EDAMAM_KEY}`;
  superagent.get(url).then(results => {
    console.log(results.body.hits[0].recipe);
    const resultsArray = results.body.hits;
    const finalArray = resultsArray.map(recipe => {
      return new Recipe(recipe);
    });
    response.render('./results.ejs', {results: finalArray});
  });
}

function Recipe(obj){
  this.label = obj.recipe.label;
  this.image_url = obj.recipe.image;
  this.ingredientLines = obj.recipe.ingredientLines;
  this.recipe_url = obj.recipe.url;
  this.dietLabels = obj.recipe.dietLabels;
  this.healthLabels = obj.recipe.healthLabels;
}

// Turn on the DB and the Server
client.connect()
  .then(
    app.listen(PORT, () => console.log(`listening on ${PORT}`))
  );
