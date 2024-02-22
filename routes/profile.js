const { Router } = require("express");
const auth = require("../middleware/auth");
const router = Router();

router.get("/", (req, res) => {
  res.render("profile", {
    title: "prifle",
    isProfile: true,
    user: req.user.toObject(),
  });
});

router.post("/", (req, res) => {});

module.exports = router;
