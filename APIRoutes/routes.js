const router = require("express").Router();
const controller = require("../controllers/controller.js");
const isAuthenticated = require("../config/middleware/isAuthenticated");

router.route("/users")
  .post(controller.users.create);

router.route("/users/:id")
  .get(isAuthenticated, controller.users.findOne)
  .put(isAuthenticated, controller.users.update)
  .delete(isAuthenticated, controller.users.remove);

router.route("/gigs")
  .get(isAuthenticated, controller.gigs.findAll)
  .put(isAuthenticated, controller.gigs.update)
  .post(isAuthenticated, controller.gigs.create)
  .delete(isAuthenticated, controller.gigs.remove);

router.route("/gigs/:id/:authorId")
  .get(isAuthenticated, controller.gigs.findOne);

router.route("/comments")
  .get(isAuthenticated, controller.comments.findAll)
  .post(isAuthenticated, controller.comments.create);

router.route("/comments/:id")
  .get(isAuthenticated, controller.comments.findOne)
  .put(isAuthenticated, controller.comments.update)
  .delete(isAuthenticated, controller.comments.remove);

module.exports = router;
