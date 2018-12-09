const express = require('express')
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const passport = require('passport')
const nodemailer = require('nodemailer');
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

// Shopper index page (may not use)//
router.get('/', (req, res) => {
    res.send('This is Shopper<<< index page')
})
// ------------------- //

// Success page for testing //
router.get('/success', (req, res) => {
    res.send('Shopper Login OK!')
})
// ----------------------- //

// Shopper login //
router.post('/login',
    passport.authenticate('shopper-local', { failureRedirect: '/#login' }),
    function (req, res, next) {
        res.redirect('/shopper/success');
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

// Shopper forget password (Email) //
router.get('/resetpasswordemail', (req,res)=>{

    res.render('empty', {layout:"emailreset"}, function(err, html){
        if(err){
            console.log('error in email template')
        }

        mailTransport.sendMail({
            from: '"Yakjiu Customer service <yakjiu.com.hk@gmail.com>',
            to: 'toomanychung <toomanychung@gmail.com>',
            subject: 'Yakjiu password reset',
            html: html
          }, function(err) {
            if(err) {
              console.error('Unable to send reset email: ' + err.stack)
            };
          });

    })

    res.send('testing Email sent')
})
// ------------------------------ //

module.exports = router;