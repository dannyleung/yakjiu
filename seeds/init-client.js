exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('clientinfo').del()
    .then(function () {
      // Inserts seed entries
      // password: test
      return knex('clientinfo').insert([
        {id: 1, username: 'VIP', password: '$2b$10$TgII7yQGvYpQ8fHlU0m44.LAX6aE5.IyF9MCyAb3eNn1d1ENrLApO', email: 'company@company.com', billing: 'Flat B, Tsing Yi', credit:5000},
        {id: 2, username: 'Vivian', password: '$2b$10$TgII7yQGvYpQ8fHlU0m44.LAX6aE5.IyF9MCyAb3eNn1d1ENrLApO', email: 'Oh@company.com', billing: 'Fuck'}
      ]);
    });
};
