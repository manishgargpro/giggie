const router = require("express").Router();
const controller = require("../controllers/controller.js");

router.route("/users")
  .post(controller.users.create);

router.route("/users/:id")
  .get(controller.users.findOne)
  .put(controller.users.update)
  .delete(controller.users.remove);

router.route("/gigs")
  .get(controller.gigs.findAll)
  .post(controller.gigs.create);

router.route("/gigs/:id")
  .get(controller.gigs.findOne)
  .put(controller.gigs.update)
  .delete(controller.gigs.remove);

router.route("/comments")
  .get(controller.comments.findAll)
  .post(controller.comments.create);

router.route("/comments/:id")
  .get(controller.comments.findOne)
  .put(controller.comments.update)
  .delete(controller.comments.remove);

module.exports = router;
