exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('clientinfo').del()
    .then(function () {
      // Inserts seed entries
      return knex('clientinfo').insert([
        {id: 1, username: 'VIP', password: 'test', email: 'company@company.com', billing: 'Flat B, Tsing Yi'}
      ]);
    });
};
