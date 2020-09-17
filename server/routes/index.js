const router = require("express").Router();
const controllers = require("../controllers/index");
const authControllers = require("../controllers/auth");
const User = require('../models/user');

const { body } = require("express-validator");

router.get(
  "/",
  controllers.getTexts
);
router.post("/", controllers.postText);

// Auth Routes
router.post(
  "/register",
  [
    body("username")
      .isLength({ min: 5 })
      .withMessage("Username needs to be at least 5 characters long.")
      .isAlphanumeric()
      .withMessage("Username can contain only alphabets and numbers.")
      .trim()
      .custom((value, { req }) => {
        //this can be done here, or in the controller (preferable, as this deals with logic, not input mistakes. Keeping it here as an example of custom validators)
        return User.findOne({ username: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              "Username exists already, please pick a different one."
            ); //validator
          }
        });
      }),

    body("email")
      .isEmail()
      .withMessage("Please Enter a valid Email.") //specific error msg for e-mail validation fail
      .normalizeEmail()
      .custom((value, { req }) => {
        //this can be done here, or in the controller (preferable, as this deals with logic, not input mistakes. Keeping it here as an example of custom validators)
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              "E-mail exists already, please pick a different one."
            ); //validator
          }
        });
      }),

    body(
      "password",
      "Please enter a password at least 5 characters long, containing both alphabets and numbers"
    ) //when a default error msg has to be used (as opposed to specific ones for failure of different checks, we pass it as the second argument)
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),

    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        //custom validator
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      }),
  ],
  authControllers.postRegister
);
router.post(
  "/login",
  [
    body("username", "Invalid Username")
      .isAlphanumeric()
      .isLength({ min: 5 })
      .trim()
      .custom((value, { req }) => {
        //this can be done here, or in the controller (preferable, as this deals with logic, not input mistakes. Keeping it here as an example of custom validators)
        return User.findOne({ username: value }).then(userDoc => {
          if (!userDoc) {
            return Promise.reject(
              "No account with this username exists!"
            ); //validator
          }
        });
      }),
    body("password", "Invalid password")
      .isAlphanumeric()
      .isLength({ min: 5 })
      .trim(),
  ],
  authControllers.postLogin
);

router.post('/logout', authControllers.postLogout)
// -*-

router.get("/getAuthStatus", authControllers.getAuthStatus);

module.exports = router;
