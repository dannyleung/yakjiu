exports.up = function(knex,Promise){
    return knex.schema.createTable('shopperinfo',(table)=>{
      table.increments();
      table.string("username").notNullable();
      table.string("password").notNullable();
      table.string("email");
      table.string("firstname");
      table.string("lastname");
      table.string("gender");
      table.integer("age");
      table.integer("googleid").defaultTo(null);
      table.integer("facebookid").defaultTo(null);
      table.string("lang").defaultTo("Chinese");
      table.integer("balance").defaultTo(0);
      table.timestamps(false,true);
    });
  }
  
  exports.down = function(knex,Promise){
    return knex.schema.dropTable('shopperinfo');
  }