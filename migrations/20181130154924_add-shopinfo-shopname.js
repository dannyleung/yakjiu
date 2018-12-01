exports.up = function(knex, Promise) {
    return knex.schema.table('shopinfo', function (table) {
        table.string('shopname')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('shopinfo', function (table) {
        table.dropUnique('shopname')
    })
};
