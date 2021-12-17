// Update with your config settings.

export default {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/data/data.db',
    },
    migrations: {
      directory: './src/migrations',
    },
    seeds: {
      directory: './src/seeds',
    },
    useNullAsDefault: true,
  },
};
