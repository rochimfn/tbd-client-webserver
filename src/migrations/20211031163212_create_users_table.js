const up = (knex) => {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
};

const down = (knex) => {
  return knex.schema.dropTable('users');
};

export {up, down};
