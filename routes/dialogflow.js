const express = require('express');
const router = express.Router();
const structjson = require('structjson');
var firebase = require("firebase");
var dateFormat = require('dateformat');

const dialogflow = require('dialogflow');
const uuid = require('uuid');

const config = require('../config/keys');

const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

var db = require('./firebaseinit');
db = firebase.firestore();
auth = firebase.auth();



// Imports the Google Cloud client library.
const { Storage } = require('@google-cloud/storage');
const { post } = require('.');

const storage = new Storage();
// Makes an authenticated API request.
async function listBuckets() {
  try {
    const results = await storage.getBuckets();

    const [buckets] = results;

    console.log('Buckets:');
    buckets.forEach(bucket => {
      console.log(bucket.name);
    });
  } catch (err) {
    console.error('ERROR:', err);
  }
}
listBuckets();

// Create a new session
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

//Event Query 
router.post('/eventQuery', async (req, res) => {

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      event: {
        // The query to send to the dialogflow agent
        name: req.body.event,
        // The language used by the client 
        languageCode: languageCode,
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }

  res.send(result)



})



// Text Query Route 

router.post('/textQuery', async (req, res) => {
  var date = Date.now();
  user = auth.currentUser;
  var cname = user.email + dateFormat(date, "yyyy-mm-dd");;
  var doc = db.collection(cname).doc();
  date = dateFormat(date, "mm-dd HH:MM");
  let messagedata = {
    message: req.body.text,
    date: date,
    sender: 'User'
  };
  doc.set(messagedata);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: req.body.text,
        // The language used by the client 
        languageCode: languageCode,
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }

  var doc = db.collection(cname).doc();
  messagedata.message = result.fulfillmentText;
  messagedata.sender = 'bot';

  doc.set(messagedata);

  res.send(result)

})

function main(
  projectId = 'fbtest-cagf',
  displayName,
  trainingPhrasesParts,
  messageTexts,
  postData,
  collectionName
) {
  // [START dialogflow_create_intent]

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const projectId = 'The Project ID to use, e.g. 'YOUR_GCP_ID';
  // const displayName = 'The display name of the intent, e.g. 'MAKE_RESERVATION';
  // const trainingPhrasesParts = 'Training phrases, e.g. 'How many people are staying?';
  // const messageTexts = 'Message texts for the agent's response when the intent is detected, e.g. 'Your reservation has been confirmed';

  // Imports the Dialogflow library
  const dialogflow = require('@google-cloud/dialogflow');

  // Instantiates the Intent Client
  const intentsClient = new dialogflow.IntentsClient();

  async function createIntent() {
    // Construct request

    // The path to identify the agent that owns the created intent.
    const agentPath = intentsClient.agentPath(projectId);

    const trainingPhrases = [];

    trainingPhrasesParts.forEach(trainingPhrasesPart => {
      const part = {
        text: trainingPhrasesPart,
      };

      // Here we create a new training phrase for each provided part.
      const trainingPhrase = {
        type: 'EXAMPLE',
        parts: [part],
      };

      trainingPhrases.push(trainingPhrase);
    });

    const messageText = {
      text: messageTexts,
    };

    const message = {
      text: messageText,
    };

    const intent = {
      displayName: displayName,
      trainingPhrases: trainingPhrases,
      messages: [message],
    };

    const createIntentRequest = {
      parent: agentPath,
      intent: intent,
    };


    // Create the intent
    const [response] = await intentsClient.createIntent(createIntentRequest);

    var intentuuid = response.name;
    var iuuid = intentuuid.split('/');
    postData.iuuid = iuuid[4];

    var doc = db.collection(collectionName).doc(postData.iuuid);


  

    console.log(postData);
    doc.set(postData);



    console.log(`Intent ${response.name} created`);

  }

  createIntent();

  // [END dialogflow_create_intent]
}



router.post('/intentSave', function (req, res, next) {
  var postData = req.body;
  let itp = [];
  let imsgt = [];

  let addtext = (postData.addText);
  let addres = (postData.irespones);



  /*
  let saddtext = addtext.split(',');
  let saddres = addres.split(',');
  */

  itp.push(postData.itraining);
 
  for (let i in addtext) {
    itp.push(addtext[i]);
}
  /*
  for (i in addres) {
    imsgt.push(addres[i]);
  }
  */

  imsgt.push(addres);

  if (!postData.brdno) {  // new
    postData.cdate = Date.now();


    main('fbtest-cagf', postData.iname, itp, imsgt, postData, "intent");


  } else {                // update

    main('fbtest-cagf', postData.iname, itp, imsgt, postData, "intent");

  }

  res.redirect('../IntentList');
});

router.post('/intentSaveClass', function (req, res, next) {
  var postData = req.body;
  let itp = [];
  let imsgt = [];

  let addtext = (postData.addText);
  let addres = (postData.irespones);



  /*
  let saddtext = addtext.split(',');
  let saddres = addres.split(',');
  */

  itp.push(postData.itraining);

  for (let i in addtext) {
    itp.push(addtext[i]);
  }
  /*
  for (i in addres) {
    imsgt.push(addres[i]);
  }
  */

  imsgt.push(addres);

  if (!postData.brdno) {  // new
    postData.cdate = Date.now();


    main('fbtest-cagf', postData.iname, itp, imsgt, postData, "intentClass");


  } else {                // update

    main('fbtest-cagf', postData.iname, itp, imsgt, postData, "intentClass");

  }

  res.redirect('../IntentListClass');
});




module.exports = router;