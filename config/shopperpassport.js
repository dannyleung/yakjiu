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
    passport.use('shopper-local', new LocalStrategy(
        function (username, password, done) {
            let userquery = knex.select("*").from("shopperinfo").where("username", username);
            userquery.then((users) => {
                if (users.length == 1) {
                    let user = users[0];
                    bcrypt.compare(password,user.password, (err,isMatch)=>{
                        if(err){
                            console.log(err)
                        } 
                        if(isMatch){
                            return done(null, user, { message: 'Login OK' });
                        } else {
                            return done(null, false,  { message: 'Incorrect password.' });
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

// serialize setting, only user this //
passport.serializeUser(function (user, done) {
    // only store the id & type in the session, use credit to check account type
    if (user.credit == undefined) {
        let session = { id: user.id, type: "shopper" }
        done(null, session);
    } else {
        let session = { id: user.id, type: "client" }
        done(null, session);
    }
});

passport.deserializeUser(async (session, done) => {
    if (session.type == 'client') {
        // console.log("Logined user is client")
        let users = await knex('clientinfo').where({ id: session.id });
        if (users.length == 0) {
            return done(new Error(`Wrong user id: ${session.id}`))
        }
        let user = users[0];
        return done(null, user)
    } else {
        // console.log("Logined user is shopper")
        let users = await knex('shopperinfo').where({ id: session.id });
        if (users.length == 0) {
            return done(new Error(`Wrong user id: ${session.id}`))
        }
        let user = users[0];
        return done(null, user)
    }
})
// serialize setting, only user this //