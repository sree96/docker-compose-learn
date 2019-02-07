const http = require('http');
const rp = require('request-promise');

class ServerHandler {
  constructor(servers) {
    this.servers = servers;
    this.lastServerIndex = 0;
    this.lasthealthyServer = "";
  }

  updateHealthyServer() {
    this.resetLasthealthyServer();
    const server = this.getServer();
    rp(`${server}/health`).then(res => {
      if (res.statusCode === 200 ) {
      }
    }).catch( error => console.log(error));
  }

  getHealthyServer(){
    this.updateHealthyServer();
    if (this.lasthealthyServer !== "") return this.lasthealthyServer;
    return this.getHealthyServer();
  }

  resetLasthealthyServer(){
    this.lasthealthyServer = "";
  }

  respond(req, response) {
  this.getHealthyServer(response);
  makeRequest(server, response);
}

  getServer() {
    const server = this.servers[this.lastServerIndex];
    ++this.lastserverIndex;
    if (this.lastserverIndex >= this.servers.length) this.lastserverIndex = 0;
    return server;
  };
}

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

module.exports = ServerHandler;
