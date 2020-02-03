
exports.up = function(knex) {
    return knex.schema
    .createTable('users', tbl =>
    {
        tbl.increments()
        tbl.string('username', 128).notNullable().unique()
        tbl.string('password', 128).notNullable()
        tbl.string('truename', 256).defaultTo(null)
    })
    .createTable('rooms', tbl =>
    {
        tbl.integer('id').unsigned().unique()
        tbl.string('name', 256)
        tbl.string('description', 2000)
        // tbl.string('treasure', 2000)
        tbl.integer('n_to').defaultTo(-1)
        tbl.integer('e_to').defaultTo(-1)
        tbl.integer('s_to').defaultTo(-1)
        tbl.integer('w_to').defaultTo(-1)

        tbl.primary('id')
    })
    .createTable('users_rooms', tbl =>
    {
        tbl.boolean('visited').notNullable().defaultTo(false)
        tbl
            .integer('user_id')
            .unsigned()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
        tbl
            .integer('room_id')
            .unsigned()
            .references('id')
            .inTable('rooms')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')

        tbl.primary(['user_id', 'room_id'])
    })
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('users_rooms')
        .dropTableIfExists('rooms')
        .dropTableIfExists('users')
};
