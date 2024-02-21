const { Router } = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const User = require("../models/user");
const keys = require("../keys");
const regEmail = require("../emails/registration");
const router = Router();

const transporter = nodemailer.createTransport(
  sendgrid({
    auth: {
      api_key: keys.ENDGRID_API_KEY,
    },
  })
);

router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "auth",
    isLogin: true,
    loginError: req.flash("loginError"),
    registerError: req.flash("registerError"),
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);
      if (areSame) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((error) => {
          if (error) {
            throw error;
          }
        });
        res.redirect("/");
      } else {
        req.flash("loginError", "Incorrect password");
        res.redirect("/auth/login#login");
      }
    } else {
      req.flash("loginError", "User does not exist");
      res.redirect("/auth/login#login");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, repeat, name } = req.body;

    const candidate = await User.findOne({ email });

    if (candidate) {
      req.flash("registerError", "A user with an email address already exists");
      res.redirect("/auth/login#register");
    } else {
      const hashPassword = await bcrypt.hash(password, 10);

      const user = new User({
        email,
        name,
        password: hashPassword,
        cart: { items: [] },
      });

      await user.save();
      await transporter.sendMail(regEmail(email));

      res.redirect("/auth/login#login");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;