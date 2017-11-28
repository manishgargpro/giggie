const router = require("express").Router();
const controller = require("../controllers/controller.js");
const isAuthenticated = require("../config/middleware/isAuthenticated");

router.route("/users")
  .post(controller.users.create);

router.route("/users/:id")
  .get(controller.users.findOne)
  .put(controller.users.update)
  .delete(controller.users.remove);

router.route("/gigs")
  .get(controller.gigs.findAll)
  .put(controller.gigs.update)
  .post(controller.gigs.create);

router.route("/gigs/:id/:authorId")
  .get(controller.gigs.findOne)
  .delete(controller.gigs.remove);

router.route("/comments")
  .get(controller.comments.findAll)
  .post(controller.comments.create);

router.route("/comments/:id")
  .get(controller.comments.findOne)
  .put(controller.comments.update)
  .delete(controller.comments.remove);

module.exports = router;
