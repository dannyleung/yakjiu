const express = require('express')
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const passport = require('passport')
let router = express.Router();

// Using Client config //
require('../config/clientpassport')(passport)
// ------------------- //

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

// Client index page (may not use)//
router.get('/', (req, res) => {
    res.send('This is client index page')
})
// ------------------- //

// Success page for testing //
router.get('/success', (req, res) => {
    res.send('Client Login OK!')
})
// ----------------------- //

// Client login //
router.post('/login',
    passport.authenticate('client-local', { failureRedirect: '/' }),
    function (req, res, next) {
        res.redirect('/client/success');
    });
// ------------ //

// client register //
router.post('/register', [
    check('email').isEmail(),
    check('username').isLength({ min: 1 }),
    check("password", "invalid password")
        .isLength({ min: 1 })], (req, res) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                console.log(errors.array())
                // res.render('users/register', { errors: errors.array() })
            } else {
                let user = req.body;
                let userquery = knex.select("*").from("clientinfo").where("username", user.username);
                // check if username already exist:
                userquery.then((rows) => {
                    if (rows.length > 0) {
                        console.log("Client already exist");
                        res.send('Client already exist, cannot register');
                        return;
                    } else {
                        //hash password
                        bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(user.password, salt, function (err, hash) {
                                // Store hash in your password DB.
                                if (err) {
                                    console.log(err);
                                    return;
                                }


                                user.password = hash;
                                // make sure all the user have 0 credit when they register
                                user.credit = 0
                                knex('clientinfo').insert(user).then((result) =>
                                    console.log(req.body) //show stored result
                                ).then((result)=>{res.send('hi')}).catch((err => {
                                    console.log(err);
                                    res.send(err)
                                }))
                            });
                        });
                    }
                }).catch((err) => {
                    console.log("Checking username error:" + err)
                })
                // end checking
            }
            return;
        })
// ---------------- //

module.exports = router;