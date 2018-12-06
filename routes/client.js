const express = require('express')
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const passport2 = require('passport')
const ClientService = require('../API/ClientService');
const nodemailer = require('nodemailer');
let router = express.Router();

// Using Client config //
require('../config/clientpassport')(passport2)
// ------------------- //

// Email setting //
const mailTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
// ------------- //

// mailTransport.sendMail({
//     from: 'Yakjiu Customer service <yakjiu.com.hk@gmail.com>',
//     to: 'toomanychung <toomanychung@gmail.com>',
//     subject: 'Thank you for being our client!',
//     html: '<h1>Hello</h1><p>Nice to meet you.</p>'
//   }, function(err){
//     if(err) {
//       console.log('Unable to send email: ' + err);
//     }
// });

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
function authCheck(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.credit != undefined) {
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
    clientService.listindex(req.user.id).then(function (result) {
        console.log(req.user)
        res.render('test', { data: result, name: req.user.username })
    })
})
// ------------------- //

// Shop info details // (Need to check id is match with owner later)
router.get('/shop/:id', authCheck, (req, res) => {
    clientService.listdetails(req.params.id).then(function (result) {
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
                                    .then((result) => { res.send('hi') })
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

// Crete new shop //
router.post('/newshop', [
    check('shopname', 'Shopname cannot be too short or too long').isLength({ min: 1, max: 20 }),
    check('quota', 'invalid quota').isInt({ min: 1, max: 20 }),
    check('credit', 'invalid credit').isInt({ min: 1, max: 100 })], function (req, res) {

        const errors = validationResult(req);
        req.body._clientid = 1 // temporary set
        // *** later change this >>> req.body._clientid = req.user.id

        if (!errors.isEmpty()) {
            console.log(errors.array())
            res.send('Problem: ' + errors.array()[0].msg)
            // res.render('users/register', { errors: errors.array() })
        } else if (req.body._clientid == undefined) {
            //** change to req.user == undefined ||  */
            //check if user id exist
            res.send('Your client id is invalid')
        } else {
            //check if credit enought to create new shop
            clientService.checkCredit(req.body._clientid).then((result) => {

                let currentCredit = result[0].credit
                let consumeCredit = req.body.quota * req.body.credit

                if (consumeCredit > currentCredit) {
                    res.send(`You don't have enough credit to make new shop`)
                } else {
                    clientService.createNewShop(req.body, (err) => {
                        if (err) {
                            res.send('Error' + err)
                        } else {
                            res.send(`You've already created a new shop!!`)
                        }
                    })
                }

            })
        }

    })
// -------------- //

// Logout page //
router.get('/logout', function (req, res) {
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