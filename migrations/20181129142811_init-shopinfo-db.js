exports.up = function(knex,Promise){
    return knex.schema.createTable('shopinfo',(table)=>{
      table.increments();
      table.integer("_clientid").unsigned();
      table.foreign('_clientid').references('clientinfo.id');
      table.string("address");
      table.date("startdate");
      table.date("enddate");
      table.specificType("taken",'integer[]');
      table.text("question1");
      table.text("question2");
      table.text("question3");
      table.text("question4");
      table.integer("credit").defaultTo(0);
      table.integer("quota").unsigned();
      table.string("status").defaultTo("Pending");
      table.timestamps(false,true);
    });
  }
  
  exports.down = function(knex,Promise){
    return knex.schema.dropTable('shopinfo');
  }