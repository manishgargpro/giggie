var express = require("express");

var router = express.Router();

var goals = require("../models/index.js");

router.get("/", function(req,res) {
  goals.all(function(data) {
    var hbsObject = {
      goals: data
    };
    console.log(hbsObject);
    res.render("index", hbsObject);
  });
});

module.exports = router;