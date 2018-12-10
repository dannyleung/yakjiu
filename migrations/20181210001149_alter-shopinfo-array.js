exports.up = function (knex, Promise) {
    return knex.schema.table('shopinfo', function (table) {
        table.specificType("question2",'text[]').alter();
        table.specificType("question3",'text[]').alter();
    })
}

exports.down = function (knex, Promise) {
    return knex.schema.table('shopinfo', function (table) {
        table.text("question2").alter();
        table.text("question3").alter();
    })
}