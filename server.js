const express = require('express');
const app = express();
const http = require('http');
const ServerHandler = require("./ServerHandler");
const servers = new ServerHandler(JSON.parse(process.env.servers));

// const getServer = () => {
//   const server = servers[lastserverIndex];
//   ++lastserverIndex;
//   if (lastserverIndex >= servers.length) lastserverIndex = 0;
//   return server;
// };

// const getHealthyServer = () => {
//   const server = getServer();
//   http.get(`${server}/health`, (res) => {
    
//   });
// }


app.get('/', (req, response) => {
  servers.respond(response);
  const server = servers.getHealthyServer();
  makeRequest(server, response);
});

const makeRequest = (url, response) => {
  http.get(url, (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        response.send(parsedData);
      } catch (e) {
        console.error(e.message);
        response.send(e.message);

      }
    });
  }).on('error', (e) => {
    response.send(e.message);
    console.error(`Got error: ${e.message}`);
  });
}


app.listen(9000);
app.on('error', () => client.end());
