const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Maine Page",
    isHome: true,
  });
});

module.exports = router;
