
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('shopperinfo').del()
    .then(function () {
      // Inserts seed entries
      // password: test
      return knex('shopperinfo').insert([
        {id: 1, username: 'admin', password: '$2b$10$TgII7yQGvYpQ8fHlU0m44.LAX6aE5.IyF9MCyAb3eNn1d1ENrLApO', email: 'toomanychung@gmail.com', firstname: 'YinChung', lastname: 'Lau', gender: 'M', age: 17},
        {id: 2, username: 'kelly', password: '$2b$10$TgII7yQGvYpQ8fHlU0m44.LAX6aE5.IyF9MCyAb3eNn1d1ENrLApO', email: 'ago@lo.com', firstname: 'Funny', lastname: 'Cheung', gender: 'F', age: 29, lang: "English"},
        {id: 3, username: 'customer1', password: '$2b$10$TgII7yQGvYpQ8fHlU0m44.LAX6aE5.IyF9MCyAb3eNn1d1ENrLApO', email: 'okok@ok.com', firstname: 'Peter', lastname: 'Chu', gender: 'M', age: 11, lang: "English"}
      ]);
    });
};
