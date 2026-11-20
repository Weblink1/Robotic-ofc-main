const http = require('http');

const port = process.env.PORT || 3000;
const timeout = 5000;

const req = http.get(`http://localhost:${port}/`, (res) => {
  console.log(JSON.stringify({
    status: 'online',
    port: port,
    statusCode: res.statusCode,
    url: `http://localhost:${port}`
  }));
  process.exit(0);
});

req.on('error', (err) => {
  console.log(JSON.stringify({
    status: 'offline',
    port: port,
    error: err.code || err.message
  }));
  process.exit(1);
});

req.setTimeout(timeout, () => {
  req.destroy();
  console.log(JSON.stringify({
    status: 'timeout',
    port: port
  }));
  process.exit(1);
});
