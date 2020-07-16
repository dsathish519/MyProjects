var express = require('express');
var router = express.Router(),
flash = require("connect-flash");
const path = require('path'),
passport = require("passport"),
LocalStrategy = require("passport-local");

User = require("../models/user");
Admin = require("../models/admin");

var mongoose = require("mongoose");

//======================================================================================================


/* showing login deatils. */
router.get('/home', function (req, res, next) {
    User.find({}, function (err, list) {
        if (err) {
            console.log(err);
        } else {

            res.render("home", {
                list: list
            });
        }
    });
});


/* GET home page. */
router.get('/', function (req, res, next) {
    User.find({}, function (err, list) {
        if (err) {
            console.log(err);
        } else {

            res.render("HomePage");
        }
    });
});

 //=====================================================================================================

/*Login*/
router.get('/LogIn', function (req, res, next) {
    res.render("LogIn");

});


router.post("/LogIn", (req, res, next) => {
    var option = req.body.option;
    if(option=="employee"){
    passport.authenticate("user", (err, user, info) => {
        if (err) {
            console.log(err);
            return next(err);
        }
        if (!user) {
            req.flash("error", "Invalid username or password");
            return res.redirect('/LogIn');
        }
        req.logIn(user, err => {
            if (err) {
                return next(err);
            }
            let redirectTo = req.session.redirectTo ? req.session.redirectTo : ('/Profile');
            delete req.session.redirectTo;
            res.redirect(redirectTo);
        });
    })(req, res, next);
}
else{
    passport.authenticate("admin", (err, user , info) => {
        if (err) {
            console.log(err);
            return next(err);
        }
        if (!user) {
            req.flash("error", "Invalid username or password");
            return res.redirect('/LogIn');
        }
        req.logIn(user, err => {
            if (err) {
                return next(err);
            }
            let redirectTo = req.session.redirectTo ? req.session.redirectTo : ('/AdminProfile');
            delete req.session.redirectTo;
            res.redirect(redirectTo);
        });
    })(req, res, next);
}
});

//================================  LOGOUT ===========================================================

router.get("/LogOut", (req, res) => {
    req.logout();
    req.flash("success", "Logged out successfully. Looking forward to seeing you again!");
    res.redirect("/");
});


//===================================================================================================

router.get('/SignIn', function (req, res) {

            res.render("SignIn");

});


router.post("/SignIn", (req, res) => {

    var name = req.body.username;
    var password = req.body.password;
    var option = req.body.option;
    var newItem = {
         username: name
    }
    if(option=="employee"){
    User.register(newItem,password, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/Login");
        }
    });
    }
    else{
       Admin.register(newItem,password, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/Login");
        }
    });
    }
});

//=========================================================================================================

router.get('/AdminProfile',(req, res) => {

            res.render("AdminProfile",{name:req.user.ename , email:req.user.email ,contact:req.user.contact ,
                desgn:req.user.desgn , desc:req.user.desc});

});

//=========================================================================================================

router.get('/Profile',(req, res) => {

            res.render("Profile",{name:req.user.ename , email:req.user.email ,contact:req.user.contact ,
                desgn:req.user.desgn , desc:req.user.desc});

});

//==========================================================================================================

router.get('/Notes', function (req, res) {

            res.render("Notes");

});

//=========================================================================================================

router.get('/Registration',function (req, res) {
            res.render("Registration",{id:req.user.id});
});


router.post("/:id/Registration",function (req, res) {
    var ename = req.body.ename;
    var email = req.body.email;
    var desgn = req.body.desgn;
    var contact = req.body.contact;
    var desc = req.body.desc;
    var existItem = {
        ename :ename,
        email :email,
        desgn :desgn,
        contact :contact,
        desc : desc
    }
    User.findById(req.params.id).exec(function (err, info) {
        if (err) {
            console.log(err);
            res.redirect('/Registration');
        } else {
            User.update(existItem,(err,info)=>{
                if(err){
                    console.log(err);
                }
                else{
                   res.redirect("/Profile");
                }
            })
        }
    });
});

//=====================================================================

router.get('/AdminRegistration',function (req, res) {
            res.render("AdminRegistration");
});

router.post("/AdminRegistration",function (req, res) {
    var ename = req.body.ename;
    var email = req.body.email;
    var desgn = req.body.desgn;
    var contact = req.body.contact;
    var desc = req.body.desc;
    var existItem = {
        ename :ename,
        email :email,
        desgn :desgn,
        contact :contact,
        desc : desc
    }
    Admin.findById(req.params.id).exec(function (err, info) {
        if (err) {
            console.log(err);
            res.redirect('/AdminRegistration');
        } else {
            Admin.update(existItem,(err,info)=>{
                if(err){
                    console.log(err);
                }
                else{
                   res.redirect("/AdminProfile");
                }
            })
        }
    });
});

//================================================================

router.get('/Employees', function (req, res) {
    User.find({}, function (err, list) {
        if (err) {
            console.log(err);
        } else {

            res.render("Employees", {
                list: list
            });
        }
    });
});

//=================================================================

router.get('/Help', function (req, res) {

            res.render("Help");
});
 //=====================================================================

router.get('/AdminHelp', function (req, res) {

            res.render("AdminHelp");

});

//======================================================================

router.get('/HomeHelp', function (req, res) {

            res.render("HomeHelp");

});

 //===========================================================

router.get('/Workflow', function (req, res) {

            res.render("Workflow");

});

 //===================================================================

router.get('/AdminWorkflow', function (req, res) {

            res.render("AdminWorkflow");

});

//===================================================================

router.get('/Contact', function (req, res, next) {

            res.render("Contact");

});

//===========================================================================

router.get('/Project', function (req, res) {

            res.render("Project");

});

//===================================================================

router.get('/AdminProject', function (req, res) {
         res.render("AdminProject");
});

/*router.post("/AdminProject",(req,res,next) => {
    var html = req.body.html;
    var js = req.body.js;
    var py = req.body.py;
    var java = req.body.java;
    var skills = {
        html : html,
        js : js,
        py : py,
        java : java
    }
    User.find({skills}, function (err, list) {
        if (err) {
            console.log(err);
        } else {

            res.render("HomePage",{
                list: list
            });
        }
    });
});*/


//===================================================================================================

router.post("/update", function (req, res) {
    res.render("update", {
        name: req.body.name,
        password: req.body.password,
        id: req.body.id
    });
});

router.post("/:id/update", function (req, res) {
    User.findByIdAndUpdate(req.params.id).exec(function (err, list) {
        if (err) {
            console.log(err);
            res.redirect('/HomePage');
        } else {

            //redirect somewhere(show page)
            list.name = req.body.name;
            list.password = req.body.password;
            list.save();

            res.redirect('/home');
        }
    });
});

//=================================================================================================

router.post("/:id/delete", (req, res) => {

    User.findByIdAndRemove(req.params.id, function (err) {
        if (err) {} else {

            res.redirect("/home");
        }
    });


});

module.exports = router;
