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
        res.redirect('../#login')
    }
}
// --------- //

//TEST ONLY//
router.get('/test', (req,res)=>{
    clientService.listallJob(1).then((result)=>{
        console.log(result)
        res.send(result)
    })
})
//

//TEST ONLY//
router.get('/test2', (req,res)=>{
    clientService.listdetailJob(20).then((result)=>{
        res.render('empty',{layout:'jobanswerpopup', data:result})
    })
})
//

// Client index page //
router.get('/', authCheck, (req, res) => {
    clientService.listindex(req.user.id).then(function (result) {
        clientService.listreviewJob(req.user.id).then((jobreview)=>{
            res.render('test', { data: result, name: req.user.username, currentCredit: req.user.credit , jobreview: jobreview})
        })
    })
})
// ------------------- //

// Shop info details //
router.get('/shop/:id', authCheck, (req, res) => {
    clientService.listdetails(req.params.id).then(function (result) {

        if (result.length < 1 || req.user.id != result[0]._clientid || req.user.credit == undefined) {
            res.send('Dont be evil')
        } else {
            res.render('shopdetails', { data: result, currentCredit: req.user.credit })
        }

    })
})
// ---------------- //

// Delete shop info //
router.delete('/shop/:id', authCheck, (req, res) => {
    clientService.listdetails(req.params.id).then(function (result) {

        if (result.length < 1 || req.user.id != result[0]._clientid || req.user.credit == undefined) {
            res.send('Dont be evil')
        } else if(result[0].taken != null){
            res.status(500)        // HTTP status 404: NotFound
            .send('already assigned');
        } else {
            clientService.deleteShop(result, (err) => {
                if (err) {
                    res.send('Error' + err)
                } else {
                    res.status(200)
                    res.send('Delete ok!!')
                }
            })
        }

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
    check('shopname', 'Shopname cannot be too short or too long').isLength({ min: 1, max: 50 }),
    check('quota', 'invalid quota').isInt({ min: 1, max: 20 }),
    check('credit', 'invalid credit').isInt({ min: 1, max: 100 })], function (req, res) {

        const errors = validationResult(req);
        req.body._clientid = req.user.id
        req.body.question2 = [req.body.question2, req.body.question2a, req.body.question2b, req.body.question2c, req.body.question2d]
        req.body.question3 = [req.body.question3, req.body.question3a, req.body.question3b, req.body.question3c, req.body.question3d]
        delete req.body.question2a;
        delete req.body.question2b;
        delete req.body.question2c;
        delete req.body.question2d;
        delete req.body.question3a;
        delete req.body.question3b;
        delete req.body.question3c;
        delete req.body.question3d;
        console.log(req.body)

        if (!errors.isEmpty()) {
            console.log(errors.array())
            res.send('Problem: ' + errors.array()[0].msg)
            // res.render('users/register', { errors: errors.array() })
        } else if (req.body._clientid == undefined || req.user == undefined) {
            //** change to req.user == undefined ||  */
            //check if user id exist
            res.send('Your client id is invalid')
        } else {
            //check if credit enought to create new shop
            clientService.checkCredit(req.body._clientid).then((result) => {

                let currentCredit = result[0].credit
                let consumeCredit = req.body.quota * req.body.credit

                if (consumeCredit > currentCredit) {
                    res.render('success', { msg: `You don't have enough credit to make new shop`, currentCredit: req.user.credit })
                } else {
                    clientService.createNewShop(req.body, (err) => {
                        if (err) {
                            res.send('Error' + err)
                        } else {
                            res.render('success', { msg: `You've already created a new shop!!`, currentCredit: req.user.credit })
                        }
                    })
                }

            })
        }

    })
// -------------- //

// Createshop page (GET)//
router.get('/createshop', authCheck, (req, res) => {
    res.render('createshop', { currentCredit: req.user.credit })
})
// --------------- //

// Job review page //
router.get('/jobreview', authCheck, (req, res) => {
    clientService.listreviewJob(req.user.id).then((result)=>{
        res.render('jobneedreview', { data:result, currentCredit: req.user.credit })
    })
})
// -------------- //

// Job review datail page //
router.get('/jobreview/:id', authCheck, (req, res) => {
    clientService.listdetailJob(req.params.id).then((result)=>{

        if(result.length <0 || result[0]._clientid != req.user.id || result[0].status != 'Review'){
            res.send(`Don't be evil`)
        } else {
            res.render('empty',{layout:'jobanswerpopup', data:result})
        }

    })
})
// -------------------- //

// Accept job //
router.post('/jobreview/:id/accept', authCheck, (req, res) => {

    clientService.listdetailJob(req.params.id).then((result)=>{

        if (result[0]._clientid != req.user.id){
            res.status(500)
            res.send('no permission to approve')
        } else {
            clientService.accecptJob(req.params.id, (err)=>{
                if(err){
                    console.log(err)
                    res.status(500)
                } else {
                    console.log('successfully approve jobid: ' + req.params.id)
                    res.send('OK')
                }
            })

        }

    })
})
// ------------- //

// Reject job //
router.post('/jobreview/:id/reject', authCheck, (req, res) => {

    clientService.listdetailJob(req.params.id).then((result)=>{

        if (result[0]._clientid != req.user.id){
            res.status(500)
            res.send('no permission to reject')
        } else {
            clientService.rejectJob(req.params.id).then((err)=>{
                console.log('successfully reject jobid: ' + req.params.id)
                res.send('OK')
            })
        }

    })

})
// ------------- //

// Show all job //
router.get('/alljob', authCheck, (req, res) =>{

    clientService.listallJob(req.user.id).then((result)=>{
        res.render('alljob', { data:result, currentCredit: req.user.credit })
    })
    
})
// ------------ //

// Job datail page (no review) //
router.get('/jobdetail/:id', authCheck, (req, res) => {
    clientService.listdetailJob(req.params.id).then((result)=>{

        if(result.length <0 || result[0]._clientid != req.user.id || result[0].status == 'Review'){
            res.send(`Don't be evil`)
        } else {
            res.render('empty',{layout:'jobdetailonly', data:result})
        }

    })
})
// -------------------- //

// Logout page //
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
// --------- //


// No this page (must place at bottom) //
router.get('*', authCheck, (req, res) => {
    res.render('404', { currentCredit: req.user.credit })
})
// ----------------------------------- //

module.exports = router;