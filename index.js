const http = require('http');
const fs = require('fs');

function readFile(filePath, response, contentType) {
  fs.readFile(filePath, (error, data) => {
    response.writeHeader(200, { 'Content-Type': contentType });
    response.end(data);
  });
}

http.createServer((request, response) => {
  const requestUrl = request.url;

  switch (requestUrl) {
    case '/css/app.css':
      readFile(`${__dirname}${requestUrl}`, response, 'text/css');
      break;
    case '/css/app.css.map':
      readFile(`${__dirname}${requestUrl}`, response, 'application/json');
      break;
    case '/app.js':
      readFile(`${__dirname}${requestUrl}`, response, 'text/javascript');
      break;
    case '/favicon.ico':
      readFile(`${__dirname}${requestUrl}`, response, 'image/x-icon');
      break;
    default:
      readFile(`${__dirname}/index.html`, response, 'text/html');
  }
}).listen(process.env.PORT);
