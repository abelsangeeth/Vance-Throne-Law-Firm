import 'dotenv/config';
import app from './app';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '127.0.0.1';

const start = async () => {
  try {
    await app.listen({ port: PORT, host: HOST });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
