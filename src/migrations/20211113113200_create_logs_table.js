
const up = (knex) => {
  return knex.schema.createTable('logs', (table) => {
    table.increments();
    table.string('database').notNullable();
    table.string('filename').unique().notNullable();
    table.string('type').notNullable();
    table.integer('is_move').defaultTo(0);
    table.integer('is_restore').defaultTo(0);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
};

const down = (knex) => {
  return knex.schema.dropTable('logs');
};

export {up, down};
