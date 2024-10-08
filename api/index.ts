import App from './app';
require('dotenv').config();

const port = Number.parseInt(process.env.PORT || '4000');
if (Number.isNaN(port)) {
  console.error('PORT must be a number');
  process.exit(1);
}

App.listen(port, async () => {
  console.info(`Serveur disponible à http://localhost:${port}`);
});


function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') throw error;
  let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
}

