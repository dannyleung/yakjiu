exports.up = function (knex, Promise) {
    return knex.schema.alterTable('shopperinfo', function (table) {
        table.unique('username')
    })
}

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('shopperinfo', function (table) {
        table.dropUnique('username')
    })
}