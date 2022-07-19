const express = require("express");

const UserRegistration = require("../models/User/UserRegistration");
const MostPopulorDoctors = require("../models/PopulorDoctors");
const specialization = require("../models/Specialization");

const router = express.Router();

// get all doctors
router.post("/api/all_doctors", (req, res, next) => {
  let dataObj = { userRole: "Doctor" };
  let data = req.body;

  dataObj = {
    $and: [
      { userRoleId: { $eq: "62d178eba8f0872015aeca8e" } },
      data._id === "" || data._id === null || !data._id
        ? {}
        : {
            _id: {
              $eq: data._id,
            },
          },
      data.firstName === "" || data.firstName === null || !data.firstName
        ? {}
        : {
            firstName: {
              $eq: data.firstName,
            },
          },
      data.specializationId === "" ||
      data.specializationId === null ||
      !data.specializationId
        ? {}
        : {
            specializationId: {
              $eq: data.specializationId,
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
      allDoctors: users,
    });
  });
});

// edit Doctor
router.put("/api/doctor/update/:id", (req, res) => {
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

// delete doctor
router.delete("/api/doctor/delete/:id", (req, res) => {
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

// Add specialization  specialization
router.post("/api/add_specialization", (req, res) => {
    let specializationData = specialization(req.body);
  
    specializationData.save((err) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      return res.status(200).json({
        success: "Specialization saved successfully",
      });
    });
  });

  
// get All specializations
router.get("/api/get_all_specialization", (req, res, next) => {
  
    specialization.find().exec((err, all_specialization) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      return res.status(200).json({
        success: "true",
        all_specialization,
      });
    });
  });


//////////////////////////// modt populor API set start/////////////////////////

// add most populor doctors 
router.post("/api/doctors/add_most_populor_doctors", (req, res) => {
  let mostPopulorDoctor = MostPopulorDoctors(req.body);

  mostPopulorDoctor.save((err) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    return res.status(200).json({
      success: "Doctoor saved successfully",
    });
  });
});



// get most populor doctors id list
router.get("/api/populor_doctors_id", (req, res, next) => {
    // console.log(req.body);
    let dataObj = {};
    let data = req.body;
  
    MostPopulorDoctors.find().exec((err, users) => {
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






//////////////////////////// modt populor API set start/////////////////////////

module.exports = router;
