const db = require("../models");

const populateObject = {
  path: "gigs",
  populate: [
    {
      path: "authorId"
    },
    {
      path: "workerId"
    },
    {
      path: "comments",
      populate: {
        path: "commentorId"
      },
      options: {
        sort: {
          date: 1
        }
      }
    }
  ],
  options: {
    sort: {
      createdDate: -1
    }
  }
}

module.exports = {
  users: {
    findOne: function (req, res) {
      db.User
        .findOne({ firebaseId: req.params.id })
        .populate(populateObject)
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(422).json(err));
    },
    create: function (req, res) {
      db.User
        .create(req.body)
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(422).json(err));
    },
    update: function (req, res) {
      db.User
        .update({ firebaseId: req.params.id }, req.body)
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(422).json(err));
    },
    remove: function (req, res) {
      db.User
        .findOne({ firebaseId: req.params.id })
        .then(dbUser => dbUser.remove())
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(422).json(err));
    }
  },
  gigs: {
    findAll: function (req, res) {
      db.Gig
        .find({
          workerId: null
        })
        .populate("authorId")
        .populate("workerId")
        .populate({
          path: "comments",
          populate: {
            path: "commentorId"
          },
          options: {
            sort: {
              date: 1
            }
          }
        })
        .sort({
          createdDate: -1
        })
        .then(dbGig => res.json(dbGig))
        .catch(err => res.status(422).json(err));
    },
    findOne: function (req, res) {
      db.Gig
        .findOne({ _id: req.params.id })
        .then(dbGig => res.json(dbGig))
        .catch(err => res.status(422).json(err));
    },
    create: function (req, res) {
      db.Gig
        .create(req.body)
        .then(dbGig => {
          return db.User.findOneAndUpdate(
            { _id: req.body.authorId },
            { $push: { gigs: dbGig._id } },
            { new: true }
          )
          .populate(populateObject);
        })
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(422).json(err));
    },
    update: function (req, res) {
      let command = {};
      if (req.body.accept) {
        command = {
          set: { $set: {workerId: req.body.workerId} },
          find: dbGig => {
            return db.User.findOneAndUpdate(
              { _id: req.body.workerId },
              { $push: { gigs: req.body.id } },
              { new: true }
            )
          }
        }
      } else {
        if (req.body.title) {
          command = {
            set: {
              $set: {
                title: req.body.title,
                description: req.body.description
              }
            },
            find: dbGig => {
              return db.User.findOne({ firebaseId: req.user.id })
            }
          }
        } else {
          command = {
            set: { $set: {workerId: undefined} },
            find: dbGig => {
              return db.User.findOneAndUpdate(
                { _id: req.body.workerId },
                { $pull: { gigs: req.body.id } },
                { new: true }
              )
            }
          }
        }
      }
      db.Gig
      .update({
        _id: req.body.id
      }, command.set)
      .then(dbGig => {
        return command.find(dbGig)
        .populate(populateObject);
      })
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
    },
    remove: function (req, res) {
      db.Gig
        .removeGigAndComments(req.body.id)
        .then(dbGig => {
          return db.User.findOneAndUpdate(
            { _id: req.body.workerId },
            { $pull: { gigs: req.body.id } },
            { new: true }
          )
          .then(dbUser => {
            return db.User.findOneAndUpdate(
              { _id: req.body.authorId },
              { $pull: { gigs: req.body.id } },
              { new: true }
            )
            .populate(populateObject);
          })          
        })
        .then(dbUser => res.json(dbUser))
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
    findOne: function (req, res) {
      db.Comment
        .findOne({ _id: req.params.id })
        .then(dbComment => res.json(dbComment))
        .catch(err => res.status(422).json(err));
    },
    create: function (req, res) {
      db.Comment
        .create(req.body)
        .then(dbComment => {
          return db.Gig.findOneAndUpdate(
            { _id: req.body.gigId },
            { $push: { comments: dbComment._id } },
            { new: true }
          )
          .then(dbGig =>{
            return db.User
            .findOne({ firebaseId: req.user.id })
            .populate(populateObject)
          });
        })
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(422).json(err));
    },
    update: function (req, res) {
      db.Comment
        .update({ _id: req.params.id }, req.body)
        .then(dbComment => res.json(dbComment))
        .catch(err => res.status(422).json(err));
    },
    remove: function (req, res) {
      db.Comment
        .findOneAndRemove({ _id: req.body.id })
        .then(dbComment => {
          return db.Gig.findOneAndUpdate(
            { _id: req.body.gigId },
            { $pull: { comments: req.body.id } },
            { new: true }
          )
          .then(dbGig =>{
            return db.User
            .findOne({ firebaseId: req.user.id })
            .populate(populateObject)
          })
        })
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(422).json(err));
    }
  }
};