var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var path = require("path");

var isAuthenticated = require("./config/middleware/isAuthenticated");

var app = express();
var PORT = process.env.PORT || 3000;

var db = require("./models");

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("public"));

require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

db.sequelize.sync().then(function() {
  console.log("Database synced")
  app.listen(PORT, function() {
    console.log("Listening on PORT " + PORT);
  });
});