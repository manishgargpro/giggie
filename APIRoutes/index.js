const router = require("express").Router();
const routes = require("./routes");


router.use("/api", routes);

router.get("/", function (req, res) {
  res.sendFile("../client/build/index.html")
})

module.exports = router;