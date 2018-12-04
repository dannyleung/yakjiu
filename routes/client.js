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

// Check auth //
function authCheck(req,res,next){
    if (req.isAuthenticated()) {
        if (req.user.credit != undefined){
            return next();
        } else {
            res.send('please logout and login as a client again')
        }
    } else {
        res.send('please login')
    }
}
// --------- //

// Client index page //
router.get('/', authCheck, (req, res) => {
    clientService.listindex(req.user.id).then(function(result){
        console.log(req.user)
        res.render('test', {data: result, name:req.user.username})
    })
})
// ------------------- //

// Shop info details // (Need to check id is match with owner later)
router.get('/shop/:id', authCheck, (req,res) =>{
    clientService.listdetails(req.params.id).then(function(result){
        res.send(result)
    })
})
// ---------------- //

// Success page for testing //
router.get('/success', (req, res) => {
    res.send('Client Login OK!')
})
// ----------------------- //

// Client login //
router.post('/login',
    passport2.authenticate('client-local', { failureRedirect: '/client/loginerror' }),
    function (req, res, next) {
        res.redirect('/client/');
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

// Logout page //
router.get('/logout', function(req, res){
    req.logout();
    res.send('You have already logout');
  });
// --------- //

// No this page (must place at bottom) //
router.get('*', (req, res) => {
    res.send('No this page!')
})
// ----------------------------------- //

module.exports = router;