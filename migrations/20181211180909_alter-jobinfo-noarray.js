exports.up = function (knex, Promise) {
    return knex.schema.table('jobinfo', function (table) {
        table.text("answer2").alter();
    })
}

exports.down = function (knex, Promise) {
    return knex.schema.table('jobinfo', function (table) {
        table.specificType("answer2",'text[]').alter();
    })
}