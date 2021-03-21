// firebaseInit.js
var firebase = require("firebase");
//import 'firebase/firestore'

firebaseConfig = {
  apiKey: "AIzaSyDy_Lrdkczo_pfWuvOUY9xqrOQLOaMlKXY",
  authDomain: "fbtest-cagf.firebaseapp.com",
  databaseURL: "https://fbtest-cagf-default-rtdb.firebaseio.com",
  projectId: "fbtest-cagf",
  storageBucket: "fbtest-cagf.appspot.com",
  messagingSenderId: "576258489680",
  appId: "1:576258489680:web:2d16909f8070562ad08055",
  measurementId: "G-RR3D9QH80H"
};

firebase.initializeApp(firebaseConfig)
var db = firebase.firestore();