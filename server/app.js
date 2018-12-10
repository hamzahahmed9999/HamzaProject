var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var hbs = require('express-handlebars');

var indexRouter = require('../routes/index');

// Controllers
const user = require('./controllers/user.js');
const userProfile = require('./controllers/userProfile.js');
const userJournal = require('./controllers/journal.js');
const search = require('./controllers/search.js');

var app = express();


var session = require('express-session');

const model = require('./models/model.js');



 var config = require('../configuration/config');

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy;


var cloudinary = require('cloudinary');
var multer = require('multer');

var storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        console.log('Only image files are allowed!');
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage});

cloudinary.config({
    cloud_name: 'dwbttzluj',
    api_key: '125348388129941',
    api_secret: 'aPTsvLknAqSFFgKGKK_6bPij2Gg'
});



// view engine setup

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '../../views/',helpers:require("../public/javascripts/helpers.js").helpers}));
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
    secret: 'sf54s84a846as684saf4s68f4afajk',
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }
}));

app.use('/', indexRouter);
user.initialize();

// Passport session setup.
passport.serializeUser(function(user, done) {
    console.log('serializeUser: ' + JSON.stringify(user));
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    console.log('deserializeUser');
    done(null, obj);
});


//Developer Routes
app.get('/ReachedToSignUp', user.ReachedToSignUp);
app.post('/signUp', user.signup);
app.post('/login', user.signin);
app.get('/profile',isAuthenticated, userProfile.getProfileDetails);
app.get('/settings',isAuthenticated, userProfile.getUserProfileData);
app.post('/editProfile',isAuthenticated, userProfile.editUserProfileData);
app.get('/logOut',isAuthenticated, user.signOut);
app.get('/showJournal/:tripType/:id',isAuthenticated, userJournal.showUserJournal);
app.get('/editJournal/:tripType/:id',isAuthenticated, userJournal.editUserJournal);
app.post('/updateJournal/:tripType/:id',isAuthenticated, userJournal.updateUserJournal);
app.get('/deleteJournal/:tripType/:id',isAuthenticated, userJournal.deleteUserJournal);
app.post('/addDiary',isAuthenticated, upload.single('image'), userProfile.addUserDiary);

app.post('/searchProfiles',isAuthenticated, search.searchProfiles);
app.get('/userJournal/:id',isAuthenticated, userJournal.UserJournal);
app.post('/addComment_Rating/:tripType/:itemID',isAuthenticated, userProfile.addCommentRating);
app.get('/addToWishList/:itemID/:itemName',isAuthenticated, userProfile.addToWishList);
app.get('/getWishList',isAuthenticated, userProfile.getWishList);
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/profile',
        failureRedirect: '/' }));
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback',
    passport.authenticate('google', { successRedirect : '/profile',failureRedirect: '/' }));

// Use the FacebookStrategy within Passport.
// passport.use(new FacebookStrategy({
//         clientID: config.facebookAuth.api_key,
//         clientSecret: config.facebookAuth.api_secret,
//         callbackURL:config.facebookAuth.callback_url,
//         profileFields: ['id', 'first_name', 'last_name', 'email']
//     },
//     function(accessToken, refreshToken, profile, done) {
//         console.log('profile email:' + JSON.stringify(profile['emails'][0]['value']));
//         console.log('profile name:' + JSON.stringify(profile['name']['givenName'] +" "+ profile['name']['familyName']));
//
//
//         let newUser={
//             userID:profile['id'],
//             userName: profile['name']['givenName'] +" "+ profile['name']['familyName'],
//             userEmail:profile['emails'][0]['value']
//         };
//
//         model.checkUserByFB_Google(newUser.userEmail,newUser.userID)
//             .then(() => {
//                 model.addUserByFB_Google(newUser.userName,newUser.userEmail,newUser.userID)
//                     .then(()=>{
//                         return done(null, newUser);
//                     })
//                     .catch(()=>{
//                         return done(null, false);
//                     })
//             })
//             .catch((err) => {
//                 console.log("Error creating new user Google: " + err);
//                 if(err===true){
//                     return done(null, newUser);
//                 } else if(err===false){
//                     return done(null, false);
//                 }
//             });
//     }
// ));
//
//
// passport.use(new GoogleStrategy({
//         clientID: config.googleAuth.CLIENT_ID,
//         clientSecret: config.googleAuth.CLIENT_SECRET,
//         callbackURL: config.googleAuth.callback_url
//     },
//     function(token, tokenSecret, profile, done) {
//         //profile.id,profile.displayName,profile.emails[0].value
//         console.log("Google profile" + JSON.stringify(profile));
//
//         let newUser={
//             userID:profile['id'],
//             userName: profile['displayName'],
//             userEmail:profile['emails'][0]['value']
//         };
//         model.checkUserByFB_Google(newUser.userEmail,newUser.userID)
//             .then(() => {
//                 model.addUserByFB_Google(newUser.userName,newUser.userEmail,newUser.userID)
//                     .then(()=>{
//                         return done(null, newUser);
//                     })
//                     .catch(()=>{
//                         return done(null, false);
//                     })
//             })
//             .catch((err) => {
//                 console.log("Error creating new user Google: " + err);
//                 if(err===true){
//                     return done(null, newUser);
//                 } else if(err===false){
//                     return done(null, false);
//                 }
//             });
//     }
// ));




function isAuthenticated(req, res, next) {
    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    console.log("Session Object : " + JSON.stringify(req.session));
    if(req.session.passport==null){
        console.log("NULL");
    } else if(req.session['passport']!=null){
        req.session.user=req.session['passport']['user'];
    }

    if (req.session.user!=null)
        return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/');
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
