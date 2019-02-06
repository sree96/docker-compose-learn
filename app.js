const express = require('express');
const app = express();
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@db:5432/postgres';

const client = new pg.Client(connectionString);
client.connect()
  .then(() => console.log('connected'))
  .catch(e => console.error('connection error', e.stack))

app.get('/', (req, res) => {
  client.query("select number from magicNumbers;", (err, result) => {
    res.send(result.rows.map((row) => row.number));
  });
})

app.post('/save', (req, res) => {
  let number;
  req.on('data', (data) => {
    number = JSON.parse(data.toString()).number;
  })
  req.on('end', () => {
    client.query(
      `INSERT INTO magicNumbers values(${number});`, (err, res) => {
        err && console.log(err);
        res.send("acknowledged");
      });
  })
});

app.listen(8000);

app.on('error', () => client.end());
