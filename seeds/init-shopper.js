
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('shopperinfo').del()
    .then(function () {
      // Inserts seed entries
      return knex('shopperinfo').insert([
        {id: 1, username: 'admin', password: 'test', email: 'admin@admin.com', firstname: 'YinChung', lastname: 'Lau', gender: 'M', age: 17}
      ]);
    });
};
