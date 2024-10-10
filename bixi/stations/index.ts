import debug from 'debug';
import App from './app';
import { connectToDatabase } from "./service/database.service"
import { Utils } from './utils/utils'

debug('ts-express:server');

const port = Number.parseInt(process.env.PORT || '4004');
if (Number.isNaN(port)) {
  console.error('PORT must be a number');
  process.exit(1);
}

connectToDatabase().then(()=>{
    let server = App.listen(port, async () => {
        console.info(`Serveur disponible à http://localhost:${port}`);
      });
    server.on('error', onError);
}).catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
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

