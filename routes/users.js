const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require('../models/User');

const {ensureAuthenticated} = require("../config/auth");

router.get('/login',(req,res) => {
    res.render('login');
});

router.get('/register',(req,res) => {
    res.render('register');
});

router.post('/register',(req,res) => {
    var name = req.body.name;
    var email = req.body.email;
    var rollNo = req.body.rollNo;
    var password = req.body.password;
    var password2 = req.body.password2;
    var errors = [];

    if(!name || !email || !password || !password2 || !rollNo){
        errors.push({msg : "Please fill in all fields"});
    }

    if(password!== password2){
        errors.push({msg : "Passwords do not match"});
    }

    if(password.length<6){
        errors.push({msg : "Passwords should be atleast 6 charecters"});
    }

    if(errors.length>0){
        res.render('register', {errors : errors,name : name,email : email,rollNo : rollNo,password : password,password2:password2});
    }

    else{
        User.findOne({email : email})
            .then(user => {
                if(user){
                    errors.push({msg : "User Aldeready Exist"});
                    res.render('register', {errors : errors,name : name,email : email,rollNo : rollNo,password : password,password2:password2});
                }
                else{
                    const newUser = new User({
                        name : name,
                        email : email,
                        rollNo : rollNo,
                        password : password
                    });
                
                    bcrypt.genSalt (10, (err,salt) => 
                        bcrypt.hash(newUser.password , salt , (err,hash) => {
                            if(err){
                                throw err;
                            }
                            else{
                                newUser.password = hash;
                                newUser.save()
                                .then(user => {
                                    req.flash("success_msg", "You are registered so log in");
                                    res.redirect("/users/login");
                                })//promise that the newUser saving completed
                                .catch(err => console.log(err));
                            }
                    }));
                }
            });
    }
});

router.post('/login', (req,res,next) => {
    passport.authenticate('local',{
        successRedirect : '/questionsPage',
        failureRedirect : '/users/login',
        failureFlash : true
    })(req,res,next);
});

router.get("/logout", (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      req.flash("success_msg" , "You are logged out");
      res.redirect('/users/login');
    });
  });

  router.get("/contact", ensureAuthenticated,(req,res) => {
    res.render('contact');
  });

  router.get("/schedule", ensureAuthenticated,(req,res) => {
    res.render('schedule');
  });

module.exports = router;