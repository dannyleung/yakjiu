const express = require('express')
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const passport = require('passport')
const nodemailer = require('nodemailer');
const ShopperService = require('../API/ShopperService');
const moment = require('moment');
const multer = require('multer');
const fs = require('fs')
const path = require('path')
const redis = require('redis');
const createToken = require('../config/createToken') //function
let router = express.Router();

// Using Shopper config //
require('../config/shopperpassport')(passport)
// ------------------- //

// Redis setup //
var redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
    password: process.env.REDIS_PASSWORD
});

redisClient.on('error', function (err) {
    console.log(err);
});

// ---------- //

// Multer setting //
var uploads = multer({
    dest: './public/uploads/',
    fileFilter: function (req, file, cb) {

        var filetypes = /jpeg|jpg/;
        var mimetype = filetypes.test(file.mimetype);
        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: File upload only supports the following filetypes - " + filetypes);
    },
    limits: { fileSize: 107374182 }
});
// -------------- //

// Email setting //
const mailTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER2,
        pass: process.env.EMAIL_PASSWORD2
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
router.post('/test', (req, res) => {
    delete req.body.repeatpassword
    delete req.body.accept
    console.log(req.body)
    res.send('OK')
})
////////////

// Shopper index page (may not use)//
router.get('/', authCheck, (req, res) => {
    shopperService.listindexlist().then((result) => {

        result.forEach(function (e) {
            e.startdate = moment(e.startdate).format('l');
            e.enddate = moment(e.enddate).format('l');
        })

        shopperService.listallpendingjob(req.user.id).then((jobbadege) => {
            res.render('shopperindex', { layout: 'shoppermain', currentCredit: req.user.balance, name: req.user.username, data: result, jobbadege: jobbadege })
        })
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
        } else if (result[0].taken.includes(req.user.id)) {

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

// List all assigned job to the user //
router.get('/assignedjob', authCheck, (req, res) => {

    shopperService.listallpendingjob(req.user.id).then((result) => {

        result.forEach(function (e) {
            e.startdate = moment(e.startdate).format('l');
            e.enddate = moment(e.enddate).format('l');
        })

        res.render('jobassignedlist', { layout: 'shoppermain', currentCredit: req.user.balance, name: req.user.username, data: result })

    })
    // res.render('jobassignedlist', { layout: 'shoppermain', currentCredit: req.user.balance, name: req.user.username })
})
// -------------------------------- //

// List all past job to the user //
router.get('/jobhistory', authCheck, (req, res) => {

    shopperService.listJobHistory(req.user.id).then((result) => {
        res.render('shopperjobhistory', { layout: 'shoppermain', currentCredit: req.user.balance, name: req.user.username, data: result })
    })

})
// ----------------------------- //

// Job datail page (no review) //
router.get('/jobdetail/:id', authCheck, (req, res) => {
    shopperService.listdetailJob(req.params.id).then((result) => {

        if (result.length < 0 || result[0]._shopperid != req.user.id) {
            res.send(`Don't be evil`)
        } else if (result[0].status == 'Review') {
            res.send('Under review cannot view')
        } else {
            res.render('empty', { layout: 'jobdetailonly', data: result })
        }

    })
})
// -------------------- //

// Surgery answer page //
router.get('/job/:id', authCheck, (req, res) => {

    shopperService.listalljobdetails(req.params.id, req.user.id).then((result) => {
        res.render('jobdetails', { layout: 'shoppermain', currentCredit: req.user.balance, name: req.user.username, data: result })
    })

})
// ------------------ //

// Surgery answer push //
router.post('/job/:id', authCheck, uploads.single('avatar'), (req, res) => {
    console.log(req.file);

    //**********************//
    var name = req.file.originalname;
    var nameArray = name.split('');
    var nameMime = [];
    l = nameArray.pop();
    nameMime.unshift(l);
    while (nameArray.length != 0 && l != '.') {
        l = nameArray.pop();
        nameMime.unshift(l);
    }
    // --save file mime-- //
    Mime = nameMime.join('');
    //**********************//


    let newFilename = req.file.filename + Mime
    req.body.answer4 = newFilename

    //Handle multer image upload//
    fs.renameSync('./public/uploads/' + req.file.filename, './public/uploads/' + newFilename, function (err) {
        if (err) {
            throw err;
        }
    })
    //*************************//

    let rawanswer3 = [req.body.answer3a, req.body.answer3b, req.body.answer3c, req.body.answer3d]

    let filteredanswer3 = rawanswer3.filter(function (el) {
        return el != null;
    });

    req.body.answer3 = filteredanswer3
    delete req.body.answer3a;
    delete req.body.answer3b;
    delete req.body.answer3c;
    delete req.body.answer3d;

    // CALL API HERE //
    shopperService.updateSurvey(req.params.id, req.body, (err) => {
        if (err) {
            res.send('Error' + err)
        } else {
            res.render('successShopper', { layout: 'shoppermain', currentCredit: req.user.balance, name: req.user.username, msg: 'You sucessfully answer the survey!' })
        }
    });

})
// ------------------ //

// Success page for testing //
router.get('/success', (req, res) => {
    res.render('empty',{layout:'redirect'})
})
// ----------------------- //

// Shopper login //
router.post('/login',
    passport.authenticate('shopper-local', { failureRedirect: '/#login' }),
    function (req, res, next) {
        res.redirect('/shopper/');
    });
// ------------ //

// Shopper registrer page //
router.get('/register', (req,res)=>{
    res.render('empty',{layout: 'shoppersignup'})
})
// ------------------- //

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
                delete user.repeatpassword
                delete user.accept
                let userquery = knex.select().from("shopperinfo").where("username", user.username);
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

                                    res.redirect('/shopper/success')

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

// Forgetpassword page //
router.get('/forgetpassword', (req, res) => {
    res.render('empty', { layout: 'forgetpassword' })
})
// ------------------- //

// Forgetpassword POST //
router.post('/forgetpassword', (req, res) => {
    console.log(req.body.username)
    let userquery = knex.select().from("shopperinfo").where("username", req.body.username);

    userquery.then(function (rows) {
        if (rows.length == 0) {
            console.log(rows)
            res.render('empty', { layout: 'forgetpassword', msg: 'User did not exist' });
        } else {
            redisClient.get(rows[0].username, function (err, data) {
                if (err) {
                    return console.log(err);
                }
                if (data != null) {
                    console.log('user already exist, the key is: ' + data)
                    res.render('empty', { layout: 'forgetpassword', msg: `You have already requested to reset password` });
                } else {
                    createToken().then(function (token) {
                        console.log('New token: ' + token)
                        redisClient.setex(token, 86400, rows[0].username, function (err, data) {
                            if (err) {
                                return console.log(err);
                            }

                            redisClient.setex(rows[0].username, 86400, token, function (err, data) {
                                if (err) {
                                    return console.log(err);
                                }
                                // Setup token OK, ready to seend email
                                res.render('empty', { layout: "emailreset", name: rows[0].username, token: token }, function (err, html) {
                                    if (err) {
                                        console.log('error in email template')
                                    }

                                    mailTransport.sendMail({
                                        from: 'Yakjiu Customer service',
                                        to: rows[0].email,
                                        subject: 'Yakjiu password reset',
                                        html: html
                                    }, function (err) {
                                        if (err) {
                                            console.error('Unable to send reset email: ' + err.stack)
                                            return;
                                        };
                                        res.render('empty', { layout: 'forgetpassword', msg: `Reset password Email have sent to ${rows[0].email}` });
                                    });

                                })


                            });
                        });
                    })
                }
            })
        }
    })

})
// ------------------- //


// Reset Password Page //
router.get('/resetpassword/token/:token', (req, res) => {

    //check token vaild or not
    redisClient.get(req.params.token, function (err, username) {
        if (err) {
            console.log(err)
            res.send('err')
            return;
        }

        if (username == null) {
            res.send('invaild token')
            return;
        }

        res.render('empty', { layout: 'resetpassword', token: req.params.token, username: username })


    })

});
// ------------------------------ //

// Reset Password request //
router.post('/resetpassword/token/:token', (req, res) => {
    console.log(req.body)
    redisClient.get(req.params.token, function (err, username) {
        if (username == null) {
            console.log('Token expired OR username not match')
            return;
        }

        let newPassword = req.body.password

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newPassword, salt, function (err, hash) {
                // Store hash in your password DB.
                if (err) {
                    console.log(err);
                    return;
                }


                newPassword = hash;
                console.log(`Hased newPassword: ${newPassword}`)

                knex('shopperinfo').where('username', username)
                    .update({ password: newPassword }).then((result) => {
                        console.log('Successfully change password!!' + result)

                        res.send('Change password success!!')

                        redisClient.del(req.params.token, function (err, response) {
                            if (response == 1) {
                                console.log("Deleted Token Successfully!")
                                redisClient.del(username, function (err, response) {
                                    if (response == 1) {
                                        console.log("Deleted User Successfully!")
                                    } else {
                                        console.log("Cannot delete User")
                                    }
                                })
                            } else {
                                console.log("Cannot delete Token")
                            }
                        })

                    }).catch((err => {
                        // console.log(err);
                        res.send('Cannot reg')
                    }))
            });
        });

    })

})
// ---------------------- //

module.exports = router;