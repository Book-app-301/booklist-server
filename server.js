'use strict';

const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;


const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
//wrote after code review
client.on('error', err => console.error(err));

app.use(cors());


app.get('/api/v1/books', (req, res) => {
  client.query(`SELECT book_id, title, author, image_url, isbn FROM books;`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

//after code review
app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));


app.get('/api/v1/books/:id', (req, res) => {
  client.query(`SELECT * FROM books WHERE book_id = ${req.params.id}`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});


app.post('/api/v1/books', bodyParser, 
  (request, res) => {
    client.query(`INSERT INTO books(author, title, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5);
  `,
    [
      request.body.author,
      request.body.title,
      request.body.isbn,
      request.body.image_url,
      request.body.description
    ]
    )
      .then(() => res.send('book added'))
      
      .catch(console.error);
    
  });

app.get('*', (req, res)=> res.redirect(CLIENT_URL));


// export PORT=3000
// export CLIENT_URL=http://localhost:8080
// Mac:     export DATABASE_URL=postgres://localhost:5432/books_app
// Windows: export DATABASE_URL=postgres://Dawn:1234@localhost:5432/books_app