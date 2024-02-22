const { body } = require("express-validator");
const User = require("../models/user");

exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Enter correct email")
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({
          email: value,
        });
        if (user) {
          return Promise.reject("This email is already taken");
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),
  body("password", "Enter correct password")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body("confirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("The password must match");
      }
      return true;
    })
    .trim(),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name must be more than 3 characters")
    .trim(),
];

exports.courseValidators = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("Min length of name should be more than 3")
    .trim(),
  body("price").isNumeric().withMessage("Enter correct number"),
  body("img", "Enter url for image").isURL(),
];
