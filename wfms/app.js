const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  session = require("express-session"),
  moment = require("moment"),
  passport = require("passport");
  const LocalStrategy = require("passport-local").Strategy,
  methodOverride = require("method-override");

  const User = require("./models/user");
  const Admin =require("./models/admin")
// requiring routes
const indexRoute = require("./routes/index");


//this is used to run on local server ie., locsalhost:3000
let url = process.env.DATABASEURL || "mongodb://localhost/sathish";
mongoose.connect(url, { useNewUrlParser: true });



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(bodyParser.json());
app.locals.moment = moment;

////////////////////////////////////  PASSPORT  ///////////////////////////////////////////
//passport configuration


app.use(session({
  secret: 'abcd',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use('user',new LocalStrategy (User.authenticate()));
passport.use('admin',new LocalStrategy (Admin.authenticate()));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  if(user!=null)
    done(null,user);
});
// pass currentUser to all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user; // req.user is an authenticated user
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//pass currentAdmin to all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.admin; // req.admin is an authenticated user
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});


// use routes
app.use("/", indexRoute);

app.listen(7006, function () {
  console.log("The Server Has Started! at port 7006");
});


