const express = require("express");
const router = express.Router();
//to be protected so link the auth

const {ensureAuthenticated} = require("../config/auth");
router.get('/',(req,res) => {
    res.render('welcome');
});

router.get("/dashboard",ensureAuthenticated,(req,res) => res.render ('dashboard', {
    user : req.user
}));
module.exports = router;