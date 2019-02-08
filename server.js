const express = require('express');
const app = express();
const ServerHandler = require("./serverHandler");
const responders = new ServerHandler(JSON.parse(process.env.servers));
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.get('/', (req, response) => {
  responders.respond(response);
});   

app.put('/discover', (req, res) => {
  const server = req.body.server;
  responders.addResponder(server);
  res.send("acknowledged");
});


app.listen(9000);
