var admin = require("firebase-admin");

var serviceAccount = require("./config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://giggie-login.firebaseio.com"
});

module.exports = admin;
