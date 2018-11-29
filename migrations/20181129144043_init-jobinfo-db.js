exports.up = function(knex,Promise){
    return knex.schema.createTable('jobinfo',(table)=>{
      table.increments();
      table.integer("_shopperid").unsigned();
      table.foreign('_shopperid').references('shopperinfo.id');
      table.integer("_clientid").unsigned();
      table.foreign('_clientid').references('clientinfo.id');
      table.integer("_shopid").unsigned();
      table.foreign('_shopid').references('shopinfo.id');
      table.text("answer1");
      table.text("answer2");
      table.text("answer3");
      table.text("answer4");
      table.string("status").defaultTo("Pending");
      table.string("payment");
      table.timestamps(false,true);
    });
  }
  
  exports.down = function(knex,Promise){
    return knex.schema.dropTable('jobinfo');
  }