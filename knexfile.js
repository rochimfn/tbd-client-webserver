// Update with your config settings.
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {

  development: {
    client: 'sqlite3',
    connection: {
      filename: join(__dirname, 'src', 'data', 'data.db'),
    },
    migrations: {
      directory: join(__dirname, 'src', 'migrations'),
    },
    seeds: {
      directory: join(__dirname, 'src', 'seeds'),
    },
    useNullAsDefault: true,
  },
};
