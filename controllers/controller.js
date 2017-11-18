const db = require("../models");

module.exports = {
  users: {
    findOne: function(req, res) {
      db.User
        .findOne({_id: req.params.id})
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(422).json(err));
    },
    create: function(req, res) {
      db.User
        .create(req.body)
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(422).json(err));
    },
    update: function(req, res) {
      db.User
        .update({_id: req.params.id}, req.body)
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(422).json(err));
    },
    remove: function(req, res) {
      db.User
        .findOne({_id: req.params.id})
        .then(dbUser => dbUser.remove())
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(422).json(err));
    }
  },
  gigs: {
    findAll: function (req, res) {
      db.Gig
        .find(req.body)
        .then(dbGig => res.json(dbGig))
        .catch(err => res.status(422).json(err));
    },
    findOne: function(req, res) {
      db.Gig
        .findOne({_id: req.params.id})
        .then(dbGig => res.json(dbGig))
        .catch(err => res.status(422).json(err));
    },
    create: function(req, res) {
      db.Gig
        .create(req.body)
        .then(dbGig => res.json(dbGig))
        .catch(err => res.status(422).json(err));
    },
    update: function(req, res) {
      db.Gig
        .update({_id: req.params.id}, req.body)
        .then(dbGig => res.json(dbGig))
        .catch(err => res.status(422).json(err));
    },
    remove: function(req, res) {
      db.Gig
        .findOne({_id: req.params.id})
        .then(dbGig => dbGig.remove())
        .then(dbGig => res.json(dbGig))
        .catch(err => res.status(422).json(err));
    }
  },
  comments: {
    findAll: function (req, res) {
      db.Comment
        .find(req.body)
        .then(dbComment => res.json(dbComment))
        .catch(err => res.status(422).json(err));
    },
    findOne: function(req, res) {
      db.Comment
        .findOne({_id: req.params.id})
        .then(dbComment => res.json(dbComment))
        .catch(err => res.status(422).json(err));
    },
    create: function(req, res) {
      db.Comment
        .create(req.body)
        .then(dbComment => res.json(dbComment))
        .catch(err => res.status(422).json(err));
    },
    update: function(req, res) {
      db.Comment
        .update({_id: req.params.id}, req.body)
        .then(dbComment => res.json(dbComment))
        .catch(err => res.status(422).json(err));
    },
    remove: function(req, res) {
      db.Comment
        .findOne({_id: req.params.id})
        .then(dbComment => dbComment.remove())
        .then(dbComment => res.json(dbComment))
        .catch(err => res.status(422).json(err));
    }
  }
};