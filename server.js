'use strict';

require('dotenv').config();



const express = require('express');
const app = express();
require('ejs');
const superagent = require('superagent');
const methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true,}));
// app.use(express.static('./public')); -----------no public folder yet
app.use(methodOverride('_method'));
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

const PORT = process.env.PORT || 3001;



app.get('/', renderHomePage);

function renderHomePage(request, response){
    response.send("hello")
}

// function renderHomePage(request, response){

//     let query = request.body. // not sure what this will be until we have the server running;

//     let url = `https://api.edamam.com/search?q=${query}&app_id=${API_ID}&app_key=${API_KEY}`;
  
//     superagent.get(url)
//       .then(results => {

//       }
//       );
//   }





client.connect()
  .then(
    app.listen(PORT, () => console.log(`listening on ${PORT}`))
  )
