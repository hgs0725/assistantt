var express = require('express');
var router = express.Router();
var firebase = require("firebase");
var dateFormat = require('dateformat');

var swal = require('sweetalert');

var crypto = require('crypto');


var db = require('./firebaseinit');
db = firebase.firestore();


router.get('/signup', function (req, res, next) {
  res.render('./accounts/signup');
});

router.get('/chat', function (req, res, next) {
  res.render('./accounts/chat');
});



router.post('/accountSave', function (req, res, next) {
  var postData = req.body;

  console.log(postData);
  var firebaseEmailAuth = firebase.auth();

  firebaseEmailAuth.createUserWithEmailAndPassword(postData.email, postData.password)
    .then(userCredential => {
      const currentUser = {
        id: userCredential.user.uid,
        email: postData.email,
        emailVerified: userCredential.user.emailVerified,
        displayName: postData.name
      }

      //DB 저장

      postData.brddate = Date.now();
      var doc = db.collection("users").doc(postData.email);
      postData.accountno = doc.id;
      let data = {
        password: postData.password,
        sid: postData.sid,
        name: postData.name,
        email: postData.email,
        cdate: postData.brddate
      }
      doc.set(data);
    }).then(() => {
      //이메일인증 
      /*
      let user = firebaseEmailAuth.currentUser;

      user.sendEmailVerification()
        .then(function () {
          console.log('Email message send~~~');
        })
        .catch('Email not sent!!!');
      //이메일 인증 끝

      //const modal = document.querySelector('#singupModal');
      //M.Modal.getInstance(modal).close();
      //signUpForm.reset();
      */
    }).catch(error => {
      console.log("error code : " + error.message);
      return false;
    });





  res.redirect('/');
});


router.get('/getlogout', function (req, res, next) {
  firebase.auth().signOut().then(() => {
    res.render('login');
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
    console.log(error);
  });


});


module.exports = router;