import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

const seed = function(knex) {
  dotenv.config();
  const insert = async function() {
    const password = await bcrypt.hash(
        process.env.PASSWORD || 'password', 10);
    return knex('users').insert([
      {id: 1,
        email: 'rochim.noviyan@gmail.com',
        password,
      },
    ]);
  };

  return knex('users').del()
      .then( (_) => {
        insert();
      })
      .catch((err) => {
        if (err) console.log(err.message);
        insert();
      });
};

export {seed};
