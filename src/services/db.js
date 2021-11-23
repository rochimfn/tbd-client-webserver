import knex from 'knex';
import config from '../../knexfile.js';

const driver = config.development;

const connection = knex(driver);

export {connection};
