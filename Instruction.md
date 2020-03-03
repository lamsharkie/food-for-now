Instructions:

1. After git clone in terminal, go inside the folder of cloned repo and type "npm install".

2. Using terminal, navigate into the folder that contains schema.sql, and type "psql -d *name of your database* -f schema.psql

3. In VSCode, Create a .env file called ".env"

4. In VSCode, Inside your .env file, put the port you'd like to use and also your postgres that routes to your database. Make sure there are no extra comas or semicolon or space.
    4.1 Postgres: DATABASE_URL=postgres://localhost:5432/*name of your database*
    4.2 PORT=*your PORT number*

5. In terminal, type "nodemon" and you should see something like this:

[nodemon] 2.0.2
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node server.js`
listening on 3000

6. Go to your browser and type: http://localhost:*your PORT number*/

7. Have fun!