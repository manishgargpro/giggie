const db = require("../models");

module.exports = {
  users: {
    findOne: function (req, res) {
      db.User
        .findOne({ firebaseId: req.params.id })
        .populate({
          path: "gigs",
          populate: [
            {
              path: "authorId"
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
        })
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
          .populate({
            path: "gigs",
            populate: [
              {
                path: "authorId"
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
          });
        })
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(422).json(err));
    },
    update: function (req, res) {
      if (req.body.accept) {
        db.Gig
        .update({
          _id: req.body.id
        }, {
          $set: {workerId: req.body.workerId}
        })
        .then(dbGig => {
          return db.User.findOneAndUpdate(
            { _id: req.body.workerId },
            { $push: { gigs: req.body.id } },
            { new: true }
          )
          .populate({
            path: "gigs",
            populate: [
              {
                path: "authorId"
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
          });
        })
        .then(dbUser => {
          res.json(dbUser)
        })
        .catch(err => res.status(422).json(err));
      } else {
        db.Gig
        .update({
          _id: req.body.id
        }, {
          $set: {workerId: undefined}
        })
        .then(dbGig => {
          return db.User.findOneAndUpdate(
            { _id: req.body.workerId },
            { $pull: { gigs: req.body.id } },
            { new: true }
          )
          .populate({
            path: "gigs",
            populate: [
              {
                path: "authorId"
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
          });
        })
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(422).json(err));
      }
    },
    remove: function (req, res) {
      db.Gig
        .findOne({ _id: req.body.id })
        .then(dbGig => dbGig.remove())
        .then(dbGig => {
          return db.User.findOneAndUpdate(
            { _id: dbGig.workerId },
            { $pull: { gigs: req.body.id } },
            { new: true }
          )
          .then(dbUser => {
            return db.User.findOneAndUpdate(
              { _id: req.body.authorId },
              { $pull: { gigs: req.body.id } },
              { new: true }
            )
            .populate({
              path: "gigs",
              populate: [
                {
                  path: "authorId"
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
            });
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
            .populate({
              path: "gigs",
              populate: [
                {
                  path: "authorId"
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
            })
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
        .findOne({ _id: req.params.id })
        .then(dbComment => dbComment.remove())
        .then(dbComment => res.json(dbComment))
        .catch(err => res.status(422).json(err));
    }
  }
};