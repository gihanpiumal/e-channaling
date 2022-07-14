const express = require("express");

const Users = require("../models/users");
const UserRegistration = require("../models/User/UserRegistration")

const router = express.Router();

//save post
router.post("/user/save", (req, res) => {
  let newUser = Users(req.body);

  newUser.save((err) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    return res.status(200).json({
      success: "posts saved successfully",
    });
  });
});

// registar a new user
router.post("/user/new_user/registration", (req, res) => {
    let newUser = UserRegistration(req.body);
  
    newUser.save((err) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      return res.status(200).json({
        success: "posts saved successfully",
      });
    });
  });


  router.get("/all_users", (req, res) => {
    // let newUser = UserRegistration(req.body);
  
    UserRegistration.find().exec((err,users) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      return res.status(200).json({
        success: "true",
        allUsers:users
      });
    });
  });





module.exports = router;
