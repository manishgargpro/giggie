var path = require("path");
var isAuthenticated = require("../config/middleware/isAuthenticated")

module.exports = function(app) {

  app.get("/", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/create_goal", function (req, res) {
  	res.sendFile(path.join(__dirname, "../public/creategoals.html"));
  });

  app.get("/update_goal", function (req, res) {
  	res.sendFile(path.join(__dirname, "../public/updategoal.html"));
  });

  app.get("/starter_packs", function (req, res) {
  	res.sendFile(path.join(__dirname, "../public/starterpack.html"));
  });
};