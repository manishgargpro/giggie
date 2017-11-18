const router = require("express").Router();
const routes = require("./routes");

// Book routes
router.use("/api", routes);

module.exports = router;
