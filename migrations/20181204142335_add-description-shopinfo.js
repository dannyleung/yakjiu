exports.up = function(knex, Promise) {
    return knex.schema.table('shopinfo', function (table) {
        table.string('description')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('shopinfo', function (table) {
        table.dropTable('description')
    })
};
