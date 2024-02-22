const { body } = require("express-validator");

exports.registerValidators = [
  body("email").isEmail().withMessage("Enter correct email"),
  body("password", "Enter correct password")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric(),
  body("confirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("The password must match");
    }
    return true;
  }),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name must be more than 3 characters"),
];
