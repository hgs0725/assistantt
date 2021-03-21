var express = require('express');
var firebase = require("firebase");
const session = require('express-session');
var router = express.Router();
var dateFormat = require('dateformat');

const dialogflow = require('dialogflow');
const uuid = require('uuid');
 
const config = require('../config/keys');

const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode

var db = require('./firebaseinit');
db = firebase.firestore();
auth = firebase.auth();

var mysql = require('sync-mysql');

/* GET home page. */
router.get('/', function (req, res, next) {

  user = auth.currentUser;
  if(user){
    res.render('./accounts/signin');
    console.log(user.email);
  }
  else{
    res.render('./accounts/login');
  }
  

  

});

router.post('/getlogin', function (req, res, next) {
  var postData = req.body;

  firebase.auth().signInWithEmailAndPassword(postData.email, postData.password)
    .then((user) => {
      req.session.email = user.email;
      req.session.save(function () {
        res.redirect('boardList');
      });
    })
    .catch((error) => {
      console.log('8t8' + error);
      if (error && error.message) {
        console.log(error.message);
      }
      res.redirect('/');
    })

});

router.get('/boardList',function(req, res, next) {
  db.collection('users').orderBy("cdate").get()
      .then((snapshot) => {
          var rows = [];
          snapshot.forEach((doc) => {
              var childData = doc.data();
              //childData.cdate = dateFormat(childData.cdate,"yyyy-mm-dd");
              rows.push(childData);
          });
          res.render('boardList', {rows: rows});
      })
      .catch((err) => {
          console.log('Error getting documents', err);
      });
});


//intent start


router.get('/IntentList',function(req, res, next) {
  db.collection('intent').orderBy("cdate").get()
      .then((snapshot) => {
          var rows = [];
          snapshot.forEach((doc) => {
              var childData = doc.data();
              childData.cdate = dateFormat(childData.cdate,"yyyy-mm-dd HH:MM");

              rows.push(childData);
          });
          res.render('./Intent/IntentList', {rows: rows});
      })
      .catch((err) => {
          console.log('Error getting documents', err);
      });
});

router.get('/IntentForm',function(req,res,next){
  if (!req.query.brdno) {// new
      res.render('Intent/IntentForm', {row:""});
      return;
  }
   
  // update
  db.collection('intent').doc(req.query.brdno).get()
        .then((doc) => {
            var childData = doc.data();
            res.render('Intent/IntentForm', {row: childData});
        })
});

router.get('/IntentDelete',function(req,res,next){

   
  console.log(req.query);

  deleteIntent('fbtest-cagf', req.query.iuuid);

  db.collection('intent').doc(req.query.iuuid).delete()
  res.redirect('IntentList');
});

router.get('/IntentRead',function(req, res, next) {
  db.collection('intent').doc(req.query.iuuid).get()
      .then((doc) => {
          var childData = doc.data();
           
          childData.cdate = dateFormat(childData.cdate,"yyyy-mm-dd hh:mm");
          res.render('Intent/IntentRead', {row: childData});
      })
});


async function deleteIntent(projectId, intentId) {
  // [START dialogflow_delete_intent]
  // Imports the Dialogflow library
  const dialogflow = require('@google-cloud/dialogflow');

  // Instantiates clients
  const intentsClient = new dialogflow.IntentsClient();

  const intentPath = intentsClient.intentPath(projectId, intentId);

  const request = {name: intentPath};

  // Send the request for deleting the intent.
  const result = await intentsClient.deleteIntent(request);
  console.log(`Intent ${intentPath} deleted`);
  return result;
  // [END dialogflow_delete_intent]
}

//intent end

router.get('/chat', function (req, res, next) {

  var user = firebase.auth().currentUser;
  if (user) {
    res.render('./chat/chat');
    console.log(user.email);
  } else {
    res.redirect('/');
  }



});


router.get('/chat1', function (req, res, next) {

  var user = firebase.auth().currentUser;
  if (user) {
    res.render('./chat/onechat');
    console.log(user.email);
  } else {
    res.redirect('/');
  }



});


router.post('/getlogout', function (req, res, next) {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    console.log('logout');
    res.redirect('/');
  }).catch((error) => {
    // An error happened.
  });
  


});


router.get('/chart', function (req, res, next) {

  db.collection('chartsample').get()
        .then((snapshot) => {
            var chartlabels = [];
            var chartdatas = [];
            snapshot.forEach((doc) => {
                var childData = doc.data();
                chartlabels.push(doc.id);
                chartdatas.push(childData.value);
            });
  
            res.render('wordchart', {chartlabels: chartlabels, chartdatas: chartdatas});
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });

});

//time start

time_dict = {'mon_nine': '월요일 9시', 'tue_nine': '화요일 9시', 'wednes_nine': '수요일 9시', 'thurs_nine': '목요일 9시',
    'fri_nine': '금요일 9시', 'mon_ten': '월요일 10시', 'tue_ten': '화요일 10시', 'wednes_ten': '수요일 10시',
    'thurs_ten': '목요일 10시', 'fri_ten': '금요일 10시', 'mon_eleven': '월요일 11시', 'tue_eleven': '화요일 11시',
    'wednes_eleven': '수요일 11시', 'thurs_eleven': '목요일 11시', 'fri_eleven': '금요일 11시', 'mon_twelve': '월요일 12시',
    'tue_twelve': '화요일 12시', 'wednes_twelve': '수요일 12시', 'thurs_twelve': '목요일 12시', 'fri_twelve': '금요일 12시',
    'mon_thirteen': '월요일 13시', 'tue_thirteen': '화요일 13시', 'wednes_thirteen': '수요일 13시',
    'thurs_thirteen': '목요일 13시', 'fri_thirteen': '금요일 13시', 'mon_fourteen': '월요일 14시',
    'tue_fourteen': '화요일 14시', 'wednes_fourteen': '수요일 14시', 'thurs_fourteen': '목요일 14시',
    'fri_fourteen': '금요일 14시', 'mon_fifteen': '월요일 15시', 'tue_fifteen': '화요일 15시', 'wednes_fifteen': '수요일 15시',
    'thurs_fifteen': '목요일 15시', 'fri_fifteen': '금요일 15시', 'mon_sixteen': '월요일 16시',
    'tue_sixteen': '화요일 16시', 'wednes_sixteen': '수요일 16시', 'thurs_sixteen': '목요일 16시', 'fri_sixteen': '금요일 16시',
    'mon_seventeen': '월요일 17시', 'tue_seventeen': '화요일 17시', 'wednes_seventeen': '수요일 17시',
    'thurs_seventeen': '목요일 17시', 'fri_seventeen': '금요일 17시',
}
router.get('', function(req, res, next){
    res.render('index.html');
})


router.get('/time', function(req, res, next){
  res.render('time');
})


router.post('/webhook', express.json(), function(req, res, next){
    let body = req.body;
    let action = body.queryResult.action;
    if(action === "check_connection") {
        return res.json(check_connection(action));
    }
})

function check_connection(action) {
    let connection = new mysql({
        host: "121.139.129.186",
        port: 3306,
        user: "root",
        password: 'wxg1297wat',
        database: 'chatbot',
    });
    let retval = connection.query("SELECT answer FROM chatbot_train_data WHERE intent = '"+action+"';");
    let responds = {
        'fulfillmentText': retval[0].answer,
    }
    console.log(responds);
    return responds;
}


router.get('/save_time/:emp_time', function(req, res, next) {
    console.log(req.params.emp_time);
    let emp_time = req.params.emp_time.split(',');
    var doc_ref = db.collection('emp_time').doc('emp_time2')
    doc_ref.set({
        "emp_time": emp_time,
    });
    res.send('저장되었습니다.');
})

router.get('/emp_result', function(req, res, next){
    const users_ref = db.collection('emp_time');
    var set_list = [];
    let time_str = String();
    users_ref.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc){
            let docs = doc.data();
            for(let item in docs){
                set_list.push(docs[item]);
            }
        });
        if(set_list.size === 0) {
            res.render('./emp_result');
        }
        else{
            let retval = set_list[0].slice();
            let ret = set_list[0];
            set_list.forEach(sets => {
                ret.forEach(times => {
                    if(sets.includes(times) === false) {
                        retval.splice(retval.indexOf(times), 1);
                    }
                })
            })
            retval.forEach(time => {
                time_str = time_str + time_dict[time] + ' ';
            })
            time_str = '공강 시간은 ' + time_str + '입니다.';
            retval = retval.join(',');
            res.render('emp_result.ejs', {
                emp_time: retval,
                time_str: time_str,
            })
    }})
})

//time end



module.exports = router;
