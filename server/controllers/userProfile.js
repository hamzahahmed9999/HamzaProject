const model = require('../models/model.js');
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'hussain-imagestorage',
    api_key: '826587816326516',
    api_secret: 'UhhqwZ47HbpaL5D9snn-jqZ-CwM'
});


module.exports = {
    initialize: function() {
        model.initialize();
    },

    getProfileDetails: function(req, res) {
        console.log("In Profile");
        model.getUserProfile(req.session.user.userID)
        .then((result) => {
            console.log("Profile Detail_1 :"+ JSON.stringify(result.tripType_1));
            res.render('Profile', { title: 'Profile | SmartTravel',logo:'images/logo.jpg', session: req.session.user,Type1:result.tripType_1,Type2:result.tripType_2,Type3:result.tripType_3 });
        })
        .catch((err) => {
            console.log("Error Signing In:" + err);
            res.json({
                'message': 'Error getting Profile',
                'obj': err
            });
        });
    },


    addUserDiary: function(req, res) {
        title = req.body.title;
        placeName = req.body.placeName;

        Description = req.body.Description;
        tripType = req.body.tripType;
        uploadFile=req.body.uploadFile;
        location=req.body.location;

        console.log("title:" + title);
        console.log("title:" + placeName);
//        console.log("title:" + locationType);
        console.log("Description:" + Description);
        console.log("tripType:" + tripType);
        console.log("image:" + req.file.path);
        console.log("location:" + location);

        let ext = req.file.path.substr(req.file.path.lastIndexOf('.') + 1);
        if(ext==="jpg" || ext==="jpeg" || ext==="png" || ext==="gif"){
            cloudinary.v2.uploader.upload(req.file.path,{ folder:"Images" }, function(error,result) {
                // add cloudinary url for the image to the campground object under image property
                if(result){
                    console.log('URL:' + result.secure_url);
                }
                let thumbnail = false;
                model.addDiary(title,placeName,Description,tripType,result.secure_url,location,thumbnail,req.session.user.userID)
                    .then((result) => {
                        console.log("Done!!" + result);
                        res.redirect('/profile');
                    })
                    .catch((err) => {
                        console.log("Cancel!!" + err);
                        res.redirect('/profile');
                    });
            });
        } else {
            cloudinary.v2.uploader.upload(req.file.path,{ resource_type: "video",folder:"Videos" }, function(error,result) {
                // add cloudinary url for the image to the campground object under image property
                if(result){
                    console.log('URL:' + result.secure_url);
                }

                let str = result.secure_url.substr(result.secure_url.lastIndexOf('.') + 1);
                let thumbnail = result.secure_url.split(str)[0];
                thumbnail = thumbnail+"jpg";
                console.log("thumbnail:"+ thumbnail);

                model.addDiary(title,placeName,Description,tripType,result.secure_url,location,thumbnail,req.session.user.userID)
                    .then((result) => {
                        console.log("Done!!" + result);
                        res.redirect('/profile');
                    })
                    .catch((err) => {
                        console.log("Cancel!!" + err);
                        res.redirect('/profile');
                    });
            });
        }
    },
    getUserProfileData: function(req, res) {
        model.getProfileData(req.session.user.userID)
            .then((result) => {
                console.log("Successfully read User Data:", result);
                res.render('Settings', { title: 'Settings | SmartTravel',logo:'/images/logo.png',updateError:false,Data:result.data,session: req.session.user });
            })
            .catch((err) => {
                console.log("Error reading User Data user:", err);
                res.redirect('/profile');
            });
    },
    editUserProfileData: function(req, res) {
        model.updateProfileData(req.body.name,req.body.email,req.body.number,req.body.age,req.body.city,req.body.country,req.session.user.userID)
            .then((result) => {
                res.render('Settings', { title: 'Settings | SmartTravel',logo:'/images/logo.png',updateError:false, session: req.session.user });

            })
            .catch((err) => {
                console.log("Error update user:", err);
                res.render('Settings', { title: 'Settings | SmartTravel',logo:'/images/logo.png',updateError:true, session: req.session.user });
            });
    },
    addCommentRating: function(req, res) {
        itemID = req.params.itemID;
        tripType = req.params.tripType;
        rate = req.body.rate;
        comment =req.body.comment;
        let typeOfTrip;
        if(tripType==='1'){
            typeOfTrip = "Within City Trips";
        } else if (tripType==='2'){
            typeOfTrip = "Out of City Trips";
        } else if (tripType==='3'){
            typeOfTrip = "Out of State Trips";
        }

         if(rate===undefined){
             rate=0;
         }
        // console.log("Rate:" + rate);
        // console.log("Comment:" + comment);
        // console.log("itemID:" + itemID +" tripType: " + typeOfTrip);
        // console.log("User: " + req.session.user.userID+" "+req.session.user.userName);

        model.addComment(comment,itemID,typeOfTrip,req.session.user.userName,req.session.user.userID)
            .then((result) => {

                if(result.totalRating!==undefined){
                    rate = parseInt(rate) + parseInt(result.totalRating)/2;
                }
                console.log("Rate:" + rate);
                model.addRating(Math.ceil(rate),itemID,typeOfTrip,result.userID).then(()=>{
                    res.redirect('/explore');
                });
            })
            .catch((err) => {
                console.log("Error update user:", err);
            });

    },
    addToWishList: function(req, res) {
        itemID = req.params.itemID;
        itemName = req.params.itemName;

        model.addToWishList(itemID,itemName,req.session.user.userID)
            .then((result) => {
                res.redirect('/getWishList');
            })
            .catch((err) => {
                console.log("Error update user:", err);
            });
    },
    getWishList: function(req, res) {
        model.getWishList(req.session.user.userID)
            .then((result) => {
                console.log('result: ' + JSON.stringify(result));
                res.render('WishList', { title: 'WishList | SmartTravel',logo:'images/logo.png', session: req.session.user,Data:result.data });
            })
            .catch((err) => {
                console.log("Error Getting WishList:", err);
            });
    }
};