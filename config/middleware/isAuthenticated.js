var admin = require("../firebase/firebase-admin.js");

module.exports = function(req, res, next) {
  var token = req.cookies.token;
  if (!req.cookies || !req.cookies.token) {
    res.json({ message: "Not signed in" }).status(401);
  }
  admin
    .auth()
    .verifyIdToken(token)
    .then(function(decodedToken) {

      req.user = { email: decodedToken.email, id: decodedToken.uid };
      next();
    })
    .catch(function(err) {
      res.json({ message: "Not signed in" }).status(401);
    });
};
