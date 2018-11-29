exports.up = function (knex, Promise) {
    return knex.schema.alterTable('clientinfo', function (table) {
        table.unique('username')
    })
}

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('clientinfo', function (table) {
        table.dropUnique('username')
    })
}