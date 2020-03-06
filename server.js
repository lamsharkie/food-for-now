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
app.post('/save', saveRecipe);
app.get('/foodforlater', renderMyList);
app.put('/edit/:recipe_id', updateRecipe);
app.delete('/delete/:recipe_id', deleteRecipe);
app.get('/aboutUs', renderAboutUs);


function updateRecipe(request, response){
  let id = request.params.recipe_id;
  let parsedIngredients = JSON.stringify(request.body.ingredientlines.split(' | '));
  console.log('hello');
  let sql = `UPDATE recipes SET ingredientLines = $1 WHERE id=$2;`;
  let safeValues = [parsedIngredients, id];
  client.query(sql, safeValues)
    .then(() => {
      response.redirect('/foodforlater');
    });
}

let query;

/////////////Teddy 3/4/2020

function deleteRecipe(request, response){
  let id = request.params.recipe_id;
  let sql = 'DELETE FROM recipes WHERE id=$1;';
  let safeValues = [id];
  client.query(sql, safeValues)
    .then(() => {
      response.redirect('/foodforlater');
    });
}
///////////////Teddy

// Functions
function renderHomePage(request, response){
  response.render('./index.ejs');
}

function renderRecipes(request, response){
  response.render('./results.ejs');
}

function renderMyList(request, response){
  const sql = `SELECT * FROM recipes;`;
  client.query(sql).then(results => {
    let recipes = results.rows;
    response.render('./mylist.ejs', {results: recipes});
  });
}

function renderAboutUs(request, response){
  response.render('./about.ejs');
}

function handleSearch(request, response) {
  query = request.body.search;
  let url = `https://api.edamam.com/search?q=${query}&app_id=${process.env.EDAMAM_ID}&app_key=${process.env.EDAMAM_KEY}`;
  superagent.get(url).then(results => {
    const resultsArray = results.body.hits;
    const finalArray = resultsArray.map(recipe => {
      return new Recipe(recipe);
    });
    response.render('./results.ejs', {results: finalArray});
  });
}

function saveRecipe(request, response) {
  console.log(request.body);
  let {label, image_url, ingredientLines, recipe_url, dietLabels, healthLabels} = request.body;
  let sql = `INSERT INTO recipes (label, image_url, ingredientlines, recipe_url, dietLabels, healthLabels) VALUES ($1, $2, $3, $4, $5, $6);`;
  let safeValues = [label, image_url, ingredientLines, recipe_url, dietLabels, healthLabels];
  client.query(sql, safeValues).then( () => {
    response.redirect(`/foodforlater`);
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
