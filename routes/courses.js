const { Router } = require("express");
const router = Router();
const Course = require("../models/course");
const auth = require("../middleware/auth");

function isOwner(course, req) {
  return course.userId.toString() === req.user._id.toString();
}

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("userId").lean();
    //.populate("userId") transform user id to data like email, name , id

    res.render("courses", {
      title: "All courses",
      isCourses: true,
      courses,
      userId: req.user ? req.user._id.toString() : null,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/remove", auth, async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.body.id,
      userId: req.user._id,
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

  try {
    const course = await Course.findById(req.params.id).lean();

    if (!isOwner(course, req)) {
      res.redirect("/courses");
    }

    res.render("course-edit", {
      title: `Edit ${course.title}`,
      course,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/edit", auth, async (req, res) => {
  try {
    if (!isOwner(course, req)) {
      res.redirect("/courses");
    }
    const { id } = req.body;
    delete req.body.id;
    const course = await Course.findById(req.params.id).lean();
    if (!isOwner(course, req)) {
      res.redirect("/courses");
    }

    Object.assign(course, req.body);
    await course.save();

    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).lean();

    res.render("course", {
      title: `course.title`,
      layout: "empty",
      course,
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
