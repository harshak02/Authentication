
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const _ = require("lodash");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

mongoose.connect("mongodb+srv://harshak02:jntucse1234@cluster0.sttwkrc.mongodb.net/CC-DSA", {useNewUrlParser: true});

const app = express();
const PORT = process.env.PORT || 3000;

require("./config/passport")(passport);

app.use(express.static("public"));
app.use(expressLayouts);
app.set('view engine','ejs');

app.use(express.urlencoded({extended: false}));
app.use(session({
    secret : "keyboard cat",
    resave : true,
    saveUninitialized : true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//global vars
app.use( (req,res,next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

app.use("/",require("./routes/app2"));//acts like home route
app.use("/users",require("./routes/users"));

app.listen(PORT, console.log(`Server started at the port ${PORT}`));

