var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("index route: " + JSON.stringify(req.session));
    console.log("user: " + JSON.stringify(req.session.user));
    console.log("passport: " + JSON.stringify(req.session.passport));
    if(req.session.user===undefined && req.session.passport===undefined){
        console.log("U have to sign In");
        res.render('index', { title: 'Login/Signup | TraveLog',logo:'images/logo.jpg',loginError: false,SignUpError: false });
    } else {
        console.log("User already exit");
        res.redirect('/profile');
    }
});

module.exports = router;
