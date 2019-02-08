const http = require('http');

class ServerHandler {
  constructor(servers) {
    this.servers = servers;
    this.lastServerIndex = 0;
  }

  respond(response) {
    const server = this.getServer();
    http.get(`${server}/health`, (res) => {
      if (res.statusCode === 200) {
        makeGetRequest(server, response)
      } else {
        this.updateHealthyServer();
      }
    });
  }

  addResponder(server) {
    console.log(server , "================")
  }
  getServer() {
    const server = this.servers[this.lastServerIndex];
    ++this.lastserverIndex;
    if (this.lastserverIndex >= this.servers.length) this.lastserverIndex = 0;
    return server;
  };
}

const makeGetRequest = (url, response) => {
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

module.exports = ServerHandler;
