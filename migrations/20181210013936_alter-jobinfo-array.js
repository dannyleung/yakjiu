exports.up = function (knex, Promise) {
    return knex.schema.table('jobinfo', function (table) {
        table.specificType("answer2",'text[]').alter();
        table.specificType("answer3",'text[]').alter();
    })
}

exports.down = function (knex, Promise) {
    return knex.schema.table('shopinfo', function (table) {
        table.text("answer2").alter();
        table.text("answer3").alter();
    })
}