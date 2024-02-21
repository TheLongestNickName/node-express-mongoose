const { Router } = require("express");
const router = Router();
const Course = require("../models/course");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const courses = await Course.find().populate("userId").lean();
  //.populate("userId") transform user id to data like email, name , id

  res.render("courses", {
    title: "All courses",
    isCourses: true,
    courses,
  });
});

router.post("/remove", auth, async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.body.id,
    });
    return res.redirect("/courses");
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id/edit", auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }

  const course = await Course.findById(req.params.id).lean();

  res.render("course-edit", {
    title: `Edit ${course.title}`,
    course,
  });
});

router.post("/edite", auth, async (req, res) => {
  const { id } = req.body;
  delete req.body.id;

  await Course.findByIdAndUpdate(id, req.body).lean();

  res.redirect("/courses");
});

router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id).lean();

  res.render("course", {
    title: `course.title`,
    layout: "empty",
    course,
  });
});

module.exports = router;
