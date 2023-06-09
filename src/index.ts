import dotenv from 'dotenv';
import app from './app';
import { database } from './database/database';

dotenv.config();

async function main() {
  try {
    await database.initialize();
    console.log('Database Connected');
    app.listen(process.env.APP_PORT);
    console.log('Server on port', process.env.APP_PORT);
  } catch (error) {
    console.error(error);
  }
}
main();
