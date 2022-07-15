const express = require("express");

const UserRegistration = require("../models/User/UserRegistration");
const UserRole = require("../models/User/UserRole");


const router = express.Router();

// registar a new user
router.post("/api/new_user/registration", (req, res) => {
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

// get all users
router.post("/api/all_users", (req, res, next) => {
  console.log(req.body);
  let dataObj = {};
  let data = req.body;

  dataObj = {
    $and: [
      data.userName === "" || data.userName === null || !data.userName
        ? {}
        : {
            userName: {
              $eq: data.userName,
            },
          },
      data.userRole === "" || data.userRole === null || !data.userRole
        ? {}
        : {
            userRole: {
              $eq: data.userRole,
            },
          },
      data.gender === "" || data.gender === null || !data.gender
        ? {}
        : {
          gender: {
              $eq: data.gender,
            },
          },
    ],
  };

  UserRegistration.find(dataObj).exec((err, users) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    return res.status(200).json({
      success: "true",
      allUsers: users,
    });
  });
});

// edit users
router.put("/api/user/update/:id", (req, res) => {
  UserRegistration.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (err) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      return res.status(200).json({
        success: "update succesfully",
      });
    }
  );
});

// delete user
router.delete("/api/user/delete/:id", (req, res) => {
  UserRegistration.findByIdAndRemove(req.params.id).exec((err, deletedUser) => {
    if (err) {
      return res.status(400).json({
        message: "Can't delete",
        err,
      });
    }

    return res.json({
      message: "Delete Succesful",
      deletedUser,
    });
  });
});


// add user role
router.post("/api/add_user_role", (req, res) => {
  let userRoleData = UserRole(req.body);

  userRoleData.save((err) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    return res.status(200).json({
      success: "User Role saved successfully",
    });
  });
});


// get All user roles
router.get("/api/get_all_user_roles", (req, res, next) => {
  
  UserRole.find().exec((err, users) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    return res.status(200).json({
      success: "true",
      users,
    });
  });
});

// edit user role
router.put("/api/user_role/update/:id", (req, res) => {
  UserRole.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (err) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      return res.status(200).json({
        success: "update succesfully",
      });
    }
  );
});

// delete user
router.delete("/api/user_role/delete/:id", (req, res) => {
  UserRole.findByIdAndRemove(req.params.id).exec((err, deletedUser) => {
    if (err) {
      return res.status(400).json({
        message: "Can't delete",
        err,
      });
    }

    return res.json({
      message: "Delete Succesful",
      deletedUser,
    });
  });
});


module.exports = router;
