const router = require("express").Router();
const path = require("path");
const routes = require("./routes");

router.use("/api", routes);

router.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
})

module.exports = router;