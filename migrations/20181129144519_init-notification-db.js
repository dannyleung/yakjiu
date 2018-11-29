exports.up = function(knex,Promise){
    return knex.schema.createTable('notifcation',(table)=>{
      table.increments();
      table.integer("_shopperid").unsigned();
      table.foreign('_shopperid').references('shopperinfo.id');
      table.integer("_clientid").unsigned();
      table.foreign('_clientid').references('clientinfo.id');
      table.string("message")
      table.boolean("unread").defaultTo(true);
      table.timestamps(false,true);
    });
  }
  
  exports.down = function(knex,Promise){
    return knex.schema.dropTable('notifcation');
  }