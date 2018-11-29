const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const passport = require('passport')

// Setting Knex server //
const knex = require('knex')({
    client: 'postgresql',
    connection: {
        database: process.env.DB_NAME,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    }
});
// ------------------ //

module.exports = function (passport) {
    passport.use('client-local', new LocalStrategy(
        function (username, password, done) {
            let userquery = knex.select("*").from("clientinfo").where("username", username);
            userquery.then((users) => {
                if (users.length == 1) {
                    let user = users[0];
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            console.log(err)
                        }
                        if (isMatch) {
                            return done(null, user, { message: 'Login OK' });
                        } else {
                            return done(null, false, { message: 'Incorrect password.' });
                        }
                    })
                } else {
                    return done(null, false, { message: 'User not found.' });
                }
            }).catch((err) => {
                if (err) { return done(err); }
            })
        }
    ));
}