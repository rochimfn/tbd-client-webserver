import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

const seed = function(knex) {
  dotenv.config();
  return knex('users').del()
      .then(async function() {
        const password = await bcrypt.hash(
            process.env.PASSWORD || 'password', 10);
        return knex('users').insert([
          {id: 1,
            email: 'rochim.noviyan@gmail.com',
            password,
          },
        ]);
      });
};

export {seed};
