const express = require('express')
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const passport2 = require('passport')
const ClientService = require('../API/ClientService');
let router = express.Router();

// Using Client config //
require('../config/clientpassport')(passport2)
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
let clientService = new ClientService(knex);
// ------------------ //

// Client index page //
  // **** 1 should change to req.user.id later
router.get('/', (req, res) => {
    clientService.listindex(1).then(function(result){
        res.render('test', {data: result})
    })
})
// ------------------- //

router.get('/shop/:id', (req,res) =>{
    clientService.listdetails(req.params.id).then(function(result){
        res.send(result)
    })
})

// Success page for testing //
router.get('/success', (req, res) => {
    res.send('Client Login OK!')
})
// ----------------------- //

// Client login //
router.post('/login',
    passport2.authenticate('client-local', { failureRedirect: '/' }),
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
                                )
                                .then((result)=>{res.send('hi')})
                                .catch((err => {
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

// No this page //
router.get('*', (req, res) => {
    res.send('No this page!')
})
// ------------ //

module.exports = router;