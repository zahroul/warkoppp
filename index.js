const http = require('http');
const fs = require('fs');

http.createServer((request, response) => {
  fs.readFile(`${__dirname}/index.html`, (error, data) => {
    response.writeHeader(200, { 'Content-Type': 'text/html' });
    response.end(data);
  });
}).listen(process.env.PORT);
