const express = require('express')
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const passport = require('passport')
const nodemailer = require('nodemailer');
const ShopperService = require('../API/ShopperService');
const moment = require('moment');
let router = express.Router();


// Using Shopper config //
require('../config/shopperpassport')(passport)
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

// Check auth //
function authCheck(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.balance != undefined) {
            return next();
        } else {
            res.send('please logout and login as a customer again')
        }
    } else {
        res.redirect('../#login')
    }
}
// --------- //

// Setting Knex server //
const knex = require('knex')({
    client: 'postgresql',
    connection: {
        database: process.env.DB_NAME,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    }
});
let shopperService = new ShopperService(knex);
// ------------------ //

//TEST ONLY//
// router.get('/test', (req, res) => {
//     shopperService.checkClientID(1).then((result) => {
//         res.send(result)
//     })
// })
////////////

// Shopper index page (may not use)//
router.get('/', authCheck, (req, res) => {
    shopperService.listindexlist().then((result) => {

        result.forEach(function (e) {
            e.startdate = moment(e.startdate).format('l');
            e.enddate = moment(e.enddate).format('l');
        })

        res.render('shopperindex', { layout: 'shoppermain', currentCredit: req.user.balance, name: req.user.username, data: result })
    })
})
// ------------------- //

// Shop info details //
router.get('/shop/:id', authCheck, (req, res) => {
    shopperService.listdetails(req.params.id).then(function (result) {

        if (result.length < 1 || result[0].status != "Live") {
            res.send('Dont be evil')
        } else {
            res.render('shopdetailsshopper', { layout: 'shoppermain', currentCredit: req.user.balance, name: req.user.username, data: result })
        }

    })
})
// ---------------- //

// Assign job request //
router.post('/shop/:id', authCheck, (req, res) => {
    shopperService.checkClientID(req.params.id).then(function (result) {
        console.log(result[0].taken)
        console.log(result[0].taken.includes(req.user.id))

        if (result[0].status != "Live") {
            res.send('Dont be evil')
        } else if(result[0].taken.includes(req.user.id)) {

            res.status(500)
            res.send('error')

        } else {

            let clientid = result[0]._clientid
            shopperService.takejob(req.params.id, req.user.id, clientid, (err) => {
                if (err) {
                    res.send('Error' + err)
                } else {
                    res.send('You take the job!')
                }
            })

        }

    })
})
// ---------------- //

// Success page for testing //
router.get('/success', (req, res) => {
    res.send('Shopper Login OK!')
})
// ----------------------- //

// Shopper login //
router.post('/login',
    passport.authenticate('shopper-local', { failureRedirect: '/#login' }),
    function (req, res, next) {
        res.redirect('/shopper/');
    });
// ------------ //

// Shopper register //
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
                let userquery = knex.select("*").from("shopperinfo").where("username", user.username);
                // check if username already exist:
                userquery.then((rows) => {
                    if (rows.length > 0) {
                        console.log("User already exist");
                        res.send('User already exist, cannot register');
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
                                // make sure all the user have 0 balance when they register
                                user.balance = 0

                                knex('shopperinfo').insert(user).then((result) => {
                                    console.log(result) //show stored result

                                    mailTransport.sendMail({
                                        from: 'Yakjiu Customer service <yakjiu.com.hk@gmail.com>',
                                        to: 'toomanychung <toomanychung@gmail.com>',
                                        subject: 'Thank you for being our Shopper!',
                                        html: `<h1>Hello NEW USER: ${user.username} </h1><p>Nice to meet you ARRRR.</p>`
                                    }, function (err) {

                                        if (err) {
                                            console.log('Unable to send email: ' + err);
                                        }

                                    });

                                    res.send('Shopper Reg success!')

                                }
                                ).catch((err => {
                                    // console.log(err);
                                    res.send('Cannot reg')
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
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
// --------- //


// Shopper forget password (Email) //
router.get('/resetpasswordemail', (req, res) => {

    res.render('empty', { layout: "emailreset" }, function (err, html) {
        if (err) {
            console.log('error in email template')
        }

        mailTransport.sendMail({
            from: '"Yakjiu Customer service <yakjiu.com.hk@gmail.com>',
            to: 'toomanychung <toomanychung@gmail.com>',
            subject: 'Yakjiu password reset',
            html: html
        }, function (err) {
            if (err) {
                console.error('Unable to send reset email: ' + err.stack)
            };
        });

    })

    res.send('testing Email sent')
})
// ------------------------------ //

module.exports = router;