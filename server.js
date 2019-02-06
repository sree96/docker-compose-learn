const express = require('express');
const app = express();
const http = require('http');
const servers = JSON.parse(process.env.servers);
let lastserverIndex = 0;

const getHealthyServer = () => {
  const server = servers[lastserverIndex];
  ++lastserverIndex;
  if (lastserverIndex >= servers.length) lastserverIndex = 0;
  return server;
};

app.get('/', (req, response) => {
  const server = getHealthyServer();
  http.get(server, (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
        `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
        `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding('utf8');
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
}); 


app.listen(9000);
app.on('error', () => client.end());
