const model = require('../models/model.js');

module.exports = {
    initialize: function() {
        model.initialize();
    },

    signup: function(req, res) {
        username = req.body.fullName;
        email = req.body.Email;
        password = req.body.password;
        phoneNumber=req.body.number;

        model.addUser(username, email, password,phoneNumber)
        .then((result) => {
            req.session.user=result;
            console.log("Successfully created new user:", result.userID);
            res.redirect('/profile');
        })
        .catch((err) => {
            console.log("Error creating new user:", err);
            res.render('index', { title: 'Login/Signup | SmartTravel',logo:'images/logo.png',loginError: false,SignUpError: true });
        });
    },

    ReachedToSignUp: function(req, res) {
        res.render('SignUp', { title: 'SignUp | SmartTravel',logo:'images/logo.png',loginError: false,SignUpError: true });
    },

    signin: function(req, res) {
        email = req.body.Email;
        password = req.body.password;

        model.loginUser(email, password)
            .then((result) => {
                console.log("SignedIn Successfully:", result.userID + " " + result.userName + " " + result.userEmail);
                req.session.user = result;
                res.redirect('/profile');
            })
            .catch((err) => {
                console.log("Error Signing In:" + err);
                res.render('index', {
                    title: 'Login/Signup | SmartTravel',
                    logo: 'images/logo.png',
                    loginError: true,
                    SignUpError: false
                });
            });
    },
    signOut: function(req, res) {
        model.logoutUser()
            .then((result) => {
                req.session.destroy(function(err) {
                    console.log("cannot access session here");
                });
                console.log("Successfully SignOut:", JSON.stringify(req.session));
                res.redirect('/');
            })
            .catch((err) => {
                console.log("Error SignOut user:", err);
                res.redirect('/profile');
            });
    }
}