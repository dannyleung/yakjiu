exports.up = function(knex,Promise){
    return knex.schema.createTable('clientinfo',(table)=>{
      table.increments();
      table.string("username").notNullable();
      table.string("password").notNullable();
      table.string("email");
      table.string("billing");
      table.integer("credit").defaultTo(0);
      table.timestamps(false,true);
    });
  }
  
  exports.down = function(knex,Promise){
    return knex.schema.dropTable('clientinfo');
  }