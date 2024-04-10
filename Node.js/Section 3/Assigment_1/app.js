const http = require("http");

const handler = require("./router");

const server = http.createServer(handler);

server.listen(3031);
