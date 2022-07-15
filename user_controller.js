const ApiResponse = require("../services/response_helper");
const Joi = require("joi");
const userRoleModel = require("./../models/user_role_model");
const userModel = require("./../models/user_model");
const uniqueValidator = require("../services/unique_validator");
const stringContent = require("../services/string_content");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const axios = require("axios");
const OTP = require("../services/otp");
const RandomPassword = require("../services/random_password");
const { object } = require("joi");
const { request } = require("express");
const mongoose = require("mongoose");
const getOTPTemplate = require("../services/otp_template");
const getPasswordTemplate = require("../services/password_template");

module.exports = {
  /// post method
  /// register new user
  /// all users register through this method
  /// all user level can have access this method
  async addUser(req, res) {
    let request = req.body;

    const schema = Joi.object({
      firstName: Joi.string().required().label("First Name"),
      lastName: Joi.string().required().label("Last Name"),
      email: Joi.string()
        .required()
        .regex(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "xxx@xx.xx",
          ""
        )
        .label("Email"),
      contactNumber: Joi.string()
        .required()
        .regex(
          /^(070)\d{7}$|^(071)\d{7}$|^(072)\d{7}$|^(074)\d{7}$|^(075)\d{7}$|^(076)\d{7}$|^(077)\d{7}$|^(078)\d{7}$/,
          "07xxxxxxxx"
        )
        .label("Contact Number"),
      extension: Joi.number().allow(null).label("Extension"),
      departmentId: Joi.string()
        .required()
        .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
        .label("Department ID")
        .messages({ "string.pattern.base": "Invalid Department Id" }),
      employeeNumber: Joi.string().empty("").label("Employee Number"),
      userName: Joi.string().required().label("User Name"),
      password: Joi.string().required().label("Password"),
      roleId: Joi.string()
        .required()
        .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
        .label("User Role ID")
        .messages({ "string.pattern.base": "Invalid User Role Id" }),
    });
    let validateResult = schema.validate(request);

    if (validateResult.error) {
      return res
        .status(400)
        .send(ApiResponse.getError(validateResult.error.details[0].message));
    }

    let uniqueValidatorResponse = await uniqueValidator.findUnique(userModel, [
      { email: request.email },
      { userName: request.userName },
    ]);
    if (uniqueValidatorResponse) {
      return res
        .status(409)
        .send(ApiResponse.getError(uniqueValidatorResponse));
    }

    request.userStatues = stringContent.userStatuesObj.pending;
    request.isFinal = true;
    request.registeredDate = new Date(Date() + "UTC");
    const salt = await bcrypt.genSalt(10);
    request.password = await bcrypt.hash(request.password, salt);

    let createdUser = await userModel.create(request);
    if (createdUser) {
      return res
        .status(201)
        .send(ApiResponse.getSuccess("Successfully Registered"));
    }
    return res.status(400).send(ApiResponse.getError("Something went wrong"));
  },

  /// post method
  /// register new user by admin through web app
  /// level 1 & level 3 users can have access this method
  async addUserWeb(req, res) {
    let request = req.body;

    const schema = Joi.object({
      firstName: Joi.string().required().label("First Name"),
      lastName: Joi.string().required().label("Last Name"),
      email: Joi.string()
        .required()
        .regex(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "xxx@xx.xx",
          ""
        )
        .label("Email"),
      contactNumber: Joi.string()
        .required()
        .regex(
          /^(070)\d{7}$|^(071)\d{7}$|^(072)\d{7}$|^(074)\d{7}$|^(075)\d{7}$|^(076)\d{7}$|^(077)\d{7}$|^(078)\d{7}$/,
          "07xxxxxxxx"
        )
        .label("Contact Number"),
      extension: Joi.number().allow(null).label("Extension"),
      departmentId: Joi.string()
        .required()
        .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
        .label("Department ID")
        .messages({ "string.pattern.base": "Invalid Department Id" }),
      employeeNumber: Joi.string().empty("").label("Employee Number"),
      userName: Joi.string().required().label("User Name"),
      roleId: Joi.string()
        .required()
        .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
        .label("User Role ID")
        .messages({ "string.pattern.base": "Invalid User Role Id" }),
    });
    let validateResult = schema.validate(request);

    if (validateResult.error) {
      return res
        .status(400)
        .send(ApiResponse.getError(validateResult.error.details[0].message));
    }

    let uniqueValidatorResponse = await uniqueValidator.findUnique(userModel, [
      { email: request.email },
      { userName: request.userName },
    ]);
    if (uniqueValidatorResponse) {
      return res
        .status(409)
        .send(ApiResponse.getError(uniqueValidatorResponse));
    }

    let randomPassword = RandomPassword.getRandomPassword();

    request.userStatues = stringContent.userStatuesObj.active;
    request.isFinal = true;
    request.registeredDate = new Date(Date() + "UTC");
    request.activeRejectDate = new Date(Date() + "UTC");
    const salt = await bcrypt.genSalt(10);
    request.password = await bcrypt.hash(randomPassword, salt);

    let createdUser = await userModel.create(request);
    if (!createdUser) {
      return res
        .status(400)
        .send(
          ApiResponse.getError("Something went wrong, cna not create user")
        );
    }
    let htmlTemplate = getPasswordTemplate(
      createdUser.firstName,
      randomPassword
    );
    axios({
      method: "post",
      url: "https://api.sendgrid.com/v3/mail/send",
      headers: {
        authorization: "Bearer " + process.env.sendGridKey,
        "content-type": "application/json",
      },
      data: {
        personalizations: [
          {
            to: [
              {
                email: createdUser.email,
                name: createdUser.firstName,
              },
            ],
            subject: "OMMS - OTP",
          },
        ],
        content: [
          {
            type: "text/html",
            value: htmlTemplate,
            // "<html><head></head><body>Click <a href='" +
            // process.env.resetPasswordBaseUrl +
            // "?email=" +
            // request.email +
            // "&code=" +
            // resetPassword +
            // "' >here</a> to reset password.</body></html>",
          },
        ],
        from: { email: "info@igrs.lk", name: "OMMS" },
        reply_to: { email: "info@igrs.lk", name: "OMMS" },
      },
    })
      .then(function (response) {
        return res
          .status(200)
          .send(ApiResponse.getSuccess("Successfully updated"));
      })
      .catch(function (error) {
        console.log(error.response.data.errors);
        return res
          .status(400)
          .send(ApiResponse.getError("Error during sending email"));
      });
    return res.status(400).send(ApiResponse.getError("Something went wrong"));
  },

  /// get method
  /// user login method
  /// all users login through this method
  /// all user level can have access this method
  async login(req, res) {
    let request = req.query;

    const schema = Joi.object({
      userName: Joi.string().required().label("User Name"),
      password: Joi.string().required().label("password"),
    });
    let validateResult = schema.validate(request);

    if (validateResult.error) {
      return res
        .status(400)
        .send(ApiResponse.getError(validateResult.error.details[0].message));
    }

    let user = await userModel.findOne({
      $and: [
        { $or: [{ userName: request.userName }, { email: request.userName }] },
        { isFinal: true },
        {
          $or: [
            { userStatues: stringContent.userStatuesObj.pending },
            { userStatues: stringContent.userStatuesObj.active },
            { userStatues: stringContent.userStatuesObj.reject },
          ],
        },
      ],
    });
    if (!user || !(await bcrypt.compare(request.password, user.password))) {
      return res
        .status(401)
        .send(ApiResponse.getError("Invalid user name or password"));
    }

    let role = await userRoleModel.findOne(
      { _id: user.roleId },
      { _id: 0, __v: 0 }
    );
    if (!role) {
      return res.status(400).send(ApiResponse.getError("Something went wrong"));
    }

    let userData = { ...user.toJSON(), ...role.toJSON() };
    delete userData.password;

    return res.status(200).send(
      ApiResponse.getSuccess({
        details: userData,
        token: jwt.sign(
          {
            _id: userData._id,
            roleName: userData.roleName,
            accessLevel: userData.accessLevel,
          },
          process.env.secretKey
        ),
      })
    );
  },

  /// get method
  /// web user login method
  /// web users login through this method
  /// level one & level two user level can have access this method
  async loginWeb(req, res) {
    let request = req.query;

    const schema = Joi.object({
      userName: Joi.string().required().label("User Name"),
      password: Joi.string().required().label("password"),
    });
    let validateResult = schema.validate(request);

    if (validateResult.error) {
      return res
        .status(400)
        .send(ApiResponse.getError(validateResult.error.details[0].message));
    }

    let user = await userModel.findOne({
      $and: [
        { $or: [{ userName: request.userName }, { email: request.userName }] },
        { isFinal: true },
        { userStatues: stringContent.userStatuesObj.active },
      ],
    });
    if (!user || !(await bcrypt.compare(request.password, user.password))) {
      return res
        .status(401)
        .send(ApiResponse.getError("Invalid user name or password"));
    }

    let role = await userRoleModel.findOne(
      { _id: user.roleId },
      { _id: 0, __v: 0 }
    );
    if (!role) {
      return res.status(400).send(ApiResponse.getError("Something went wrong"));
    }

    if (
      !(
        role.accessLevel.substring(0, 1) === "1" ||
        role.accessLevel.substring(1, 2) === "1" ||
        role.accessLevel.substring(2, 3) === "1"
      )
    )
      return res
        .status(400)
        .send(ApiResponse.getError("You are not allow to access"));

    let userData = { ...user.toJSON(), ...role.toJSON() };
    delete userData.password;

    return res.status(200).send(
      ApiResponse.getSuccess({
        details: userData,
        token: jwt.sign(
          {
            _id: userData._id,
            roleName: userData.roleName,
            accessLevel: userData.accessLevel,
          },
          process.env.secretKey
        ),
      })
    );
  },

  /// get method
  /// return all users (without deleted state and requested user) when filters are empty
  /// can have add three filters _id, user statues & user role
  /// level 1 & level 2 user can have access this method
  async getUser(req, res) {
    let { pageNo, pageSize } = req.query;
    let request = req.body;

    const schema = Joi.object({
      userId: Joi.string()
        .empty("")
        .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
        .label("User ID")
        .messages({ "string.pattern.base": "Invalid User Id" }),
      userRoleId: Joi.string()
        .empty("")
        .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
        .label("User Role ID")
        .messages({ "string.pattern.base": "Invalid User Role Id" }),
      userStatues: Joi.string().empty("").label("User Statues"),
      employeeName: Joi.string().empty("").label("Employee Name"),
    });
    let validateResult = schema.validate(request);
    if (validateResult.error) {
      return res
        .status(400)
        .send(ApiResponse.getError(validateResult.error.details[0].message));
    }

    condition = {
      $and: [
        request.employeeName === "" ||
        request.employeeName === null ||
        !request.employeeName
          ? {}
          : {
              $or: [
                {
                  firstName: {
                    $regex: new RegExp(request.employeeName, "i"),
                  },
                },
                {
                  lastName: {
                    $regex: new RegExp(request.employeeName, "i"),
                  },
                },
              ],
            },
        { isFinal: true },
        { _id: { $ne: mongoose.Types.ObjectId(req.userId) } },
        request.userId === ""
          ? {}
          : {
              _id: {
                $eq: mongoose.Types.ObjectId(request.userId),
              },
            },
        request.userRoleId === ""
          ? {}
          : {
              roleId: {
                $eq: mongoose.Types.ObjectId(request.userRoleId),
              },
            },
        request.userStatues === ""
          ? {
              $or: [
                {
                  userStatues: {
                    $eq: stringContent.userStatuesObj.pending,
                  },
                },
                {
                  userStatues: {
                    $eq: stringContent.userStatuesObj.active,
                  },
                },
                {
                  userStatues: {
                    $eq: stringContent.userStatuesObj.reject,
                  },
                },
                {
                  userStatues: {
                    $eq: stringContent.userStatuesObj.deactivate,
                  },
                },
              ],
            }
          : {
              userStatues: {
                $eq: request.userStatues,
              },
            },
      ],
    };
    let users = await userModel
      .aggregate([
        { $match: condition },
        {
          $lookup: {
            from: "departments",
            localField: "departmentId",
            foreignField: "_id",
            as: "department",
          },
        },
        {
          $unwind: {
            path: "$department",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "user_roles",
            localField: "roleId",
            foreignField: "_id",
            as: "userRole",
          },
        },
        {
          $unwind: {
            path: "$userRole",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            $expr: { $ne: ["1", { $substr: ["$userRole.accessLevel", 0, 1] }] },
          },
        },
      ])
      .sort({ firstName: 1 });

    // if (users) return res.status(200).send(ApiResponse.getSuccess(users));
    // return res.status(400).send(ApiResponse.getError("Something went wrong"));

    if (users) {
      if (pageNo && pageSize) {
        response = {
          users: users.slice((pageNo - 1) * pageSize, pageNo * pageSize),
          noOfPages: Math.ceil(users.length / pageSize),
          noOfRecords: users.length,
        };
        return res.status(200).send(ApiResponse.getSuccess(response));
      } else {
        return res.status(200).send(
          ApiResponse.getSuccess({
            users: users,
          })
        );
      }
    }
    return res.status(400).send(ApiResponse.getError("Something went wrong"));
  },

  /// get method
  /// return all maintenance users (without deleted & pending state and requested user) when filters are empty
  /// can have add three filters _id, user statues, name & user role
  /// level 1, level 2 & level 3 user can have access this method
  async getAllMaintenanceUser(req, res) {
    let { pageNo, pageSize } = req.query;
    let request = req.body;

    const schema = Joi.object({
      userId: Joi.string()
        .empty("")
        .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
        .label("User ID")
        .messages({ "string.pattern.base": "Invalid User Id" }),
      userRoleId: Joi.string()
        .empty("")
        .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
        .label("User Role ID")
        .messages({ "string.pattern.base": "Invalid User Role Id" }),
      userStatues: Joi.string().empty("").label("User Statues"),
      employeeName: Joi.string().empty("").label("Employee Name"),
    });
    let validateResult = schema.validate(request);
    if (validateResult.error) {
      return res
        .status(400)
        .send(ApiResponse.getError(validateResult.error.details[0].message));
    }

    condition = {
      $and: [
        request.employeeName === "" ||
        request.employeeName === null ||
        !request.employeeName
          ? {}
          : {
              $or: [
                {
                  firstName: {
                    $regex: new RegExp(request.employeeName, "i"),
                  },
                },
                {
                  lastName: {
                    $regex: new RegExp(request.employeeName, "i"),
                  },
                },
              ],
            },
        { isFinal: true },
        { _id: { $ne: mongoose.Types.ObjectId(req.userId) } },
        request.userId === ""
          ? {}
          : {
              _id: {
                $eq: mongoose.Types.ObjectId(request.userId),
              },
            },
        request.userRoleId === ""
          ? {}
          : {
              roleId: {
                $eq: mongoose.Types.ObjectId(request.userRoleId),
              },
            },
        request.userStatues === ""
          ? {
              userStatues: {
                $eq: stringContent.userStatuesObj.active,
              },
            }
          : {
              userStatues: {
                $eq: request.userStatues,
              },
            },
      ],
    };

    let users = await userModel
      .aggregate([
        { $match: condition },
        {
          $lookup: {
            from: "departments",
            localField: "departmentId",
            foreignField: "_id",
            as: "department",
          },
        },
        {
          $unwind: {
            path: "$department",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "user_roles",
            localField: "roleId",
            foreignField: "_id",
            as: "userRole",
          },
        },
        {
          $unwind: {
            path: "$userRole",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            $expr: { $eq: ["1", { $substr: ["$userRole.accessLevel", 3, 1] }] },
          },
        },
      ])
      .sort({ firstName: 1 });

    // if (users) return res.status(200).send(ApiResponse.getSuccess(users));
    // return res.status(400).send(ApiResponse.getError("Something went wrong"));

    if (users) {
      if (pageNo && pageSize) {
        response = {
          users: users.slice((pageNo - 1) * pageSize, pageNo * pageSize),
          noOfPages: Math.ceil(users.length / pageSize),
          noOfRecords: users.length,
        };
        return res.status(200).send(ApiResponse.getSuccess(response));
      } else {
        return res.status(200).send(
          ApiResponse.getSuccess({
            users: users,
          })
        );
      }
    }
    return res.status(400).send(ApiResponse.getError("Something went wrong"));
  },

  /// get method
  /// return all users (without deleted & pending state and requested user) when filters are empty
  /// can have add three filters _id, user statues, name & user role
  /// level 1 & level 2 user can have access this method
  async getActiveUser(req, res) {
    let { pageNo, pageSize } = req.query;
    let request = req.body;

    const schema = Joi.object({
      userId: Joi.string()
        .empty("")
        .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
        .label("User ID")
        .messages({ "string.pattern.base": "Invalid User Id" }),
      userRoleId: Joi.string()
        .empty("")
        .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
        .label("User Role ID")
        .messages({ "string.pattern.base": "Invalid User Role Id" }),
      userStatues: Joi.string().empty("").label("User Statues"),
      employeeName: Joi.string().empty("").label("Employee Name"),
    });
    let validateResult = schema.validate(request);
    if (validateResult.error) {
      return res
        .status(400)
        .send(ApiResponse.getError(validateResult.error.details[0].message));
    }

    condition = {
      $and: [
        request.employeeName === "" ||
        request.employeeName === null ||
        !request.employeeName
          ? {}
          : {
              $or: [
                {
                  firstName: {
                    $regex: new RegExp(request.employeeName, "i"),
                  },
                },
                {
                  lastName: {
                    $regex: new RegExp(request.employeeName, "i"),
                  },
                },
              ],
            },
        { isFinal: true },
        { _id: { $ne: mongoose.Types.ObjectId(req.userId) } },
        request.userId === ""
          ? {}
          : {
              _id: {
                $eq: mongoose.Types.ObjectId(request.userId),
              },
            },
        request.userRoleId === ""
          ? {}
          : {
              roleId: {
                $eq: mongoose.Types.ObjectId(request.userRoleId),
              },
            },
        request.userStatues === ""
          ? {
              $or: [
                {
                  userStatues: {
                    $eq: stringContent.userStatuesObj.active,
                  },
                },
                {
                  userStatues: {
                    $eq: stringContent.userStatuesObj.reject,
                  },
                },
                {
                  userStatues: {
                    $eq: stringContent.userStatuesObj.deactivate,
                  },
                },
              ],
            }
          : {
              userStatues: {
                $eq: request.userStatues,
              },
            },
      ],
    };
    let users = await userModel
      .aggregate([
        { $match: condition },
        {
          $lookup: {
            from: "departments",
            localField: "departmentId",
            foreignField: "_id",
            as: "department",
          },
        },
        {
          $unwind: {
            path: "$department",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "user_roles",
            localField: "roleId",
            foreignField: "_id",
            as: "userRole",
          },
        },
        {
          $unwind: {
            path: "$userRole",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            $expr: { $ne: ["1", { $substr: ["$userRole.accessLevel", 0, 1] }] },
          },
        },
      ])
      .sort({ firstName: 1 });

    // if (users) return res.status(200).send(ApiResponse.getSuccess(users));
    // return res.status(400).send(ApiResponse.getError("Something went wrong"));

    if (users) {
      if (pageNo && pageSize) {
        response = {
          users: users.slice((pageNo - 1) * pageSize, pageNo * pageSize),
          noOfPages: Math.ceil(users.length / pageSize),
          noOfRecords: users.length,
        };
        return res.status(200).send(ApiResponse.getSuccess(response));
      } else {
        return res.status(200).send(
          ApiResponse.getSuccess({
            users: users,
          })
        );
      }
    }
    return res.status(400).send(ApiResponse.getError("Something went wrong"));
  },

  /// put method
  /// user statues change method
  /// all user statues change through this method
  /// level 1 & level 2 user only access this method
  async changeUserStatues(req, res) {
    let request = req.body;
    let userId = req.params.id;

    const schema = Joi.object({
      userStatues: Joi.string().required().label("User Statues"),
      roleId: Joi.string()
        .empty("")
        .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
        .label("User Role ID")
        .messages({ "string.pattern.base": "Invalid User Role Id" }),
    });
    let validateResult = schema.validate(request);
    if (validateResult.error) {
      return res
        .status(400)
        .send(ApiResponse.getError(validateResult.error.details[0].message));
    }

    if (request.roleId === "" || request.roleId === null || !request.roleId)
      delete request.roleId;

    if (
      request.userStatues === stringContent.userStatuesObj.active ||
      request.userStatues === stringContent.userStatuesObj.reject
    )
      request.activeRejectDate = new Date(Date() + "UTC");
    else if (
      request.userStatues === stringContent.userStatuesObj.deactivate ||
      request.userStatues === stringContent.userStatuesObj.delete
    )
      request.deactivateDeleteDate = new Date(Date() + "UTC");
    else
      return res.status(400).send(ApiResponse.getError("Invalid user statues"));

    let updatedUser = await userModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(userId), isFinal: true },
      {
        $set: request,
      },
      { new: true }
    );
    if (!updatedUser)
      return res.status(400).send(ApiResponse.getError("Something went wrong"));
    return res.status(200).send(ApiResponse.getSuccess(updatedUser));
  },

  /// put method
  /// user details edit method
  /// edit all user details using _id
  /// all users can have access this method
  async editUser(req, res) {
    let userId = req.params.id;
    let request = req.body;

    const schema = Joi.object({
      firstName: Joi.string().empty("").label("First Name"),
      lastName: Joi.string().empty("").label("Last Name"),
      email: Joi.string()
        .empty("")
        .regex(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "xxx@xx.xx",
          ""
        )
        .label("Email"),
      contactNumber: Joi.string()
        .empty("")
        .regex(
          /^(070)\d{7}$|^(071)\d{7}$|^(072)\d{7}$|^(074)\d{7}$|^(075)\d{7}$|^(076)\d{7}$|^(077)\d{7}$|^(078)\d{7}$/,
          "07xxxxxxxx"
        )
        .label("Contact Number"),
      extension: Joi.number().allow(null).label("Extension"),
      departmentId: Joi.string()
        .empty("")
        .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
        .label("Department ID")
        .messages({ "string.pattern.base": "Invalid Department Id" }),
      employeeNumber: Joi.string().empty("").label("Employee Number"),
      userName: Joi.string().empty("").label("User Name"),
      currentPassword: Joi.string().empty("").label("Current Password"),
      password: Joi.string().empty("").label("Password"),
      roleId: Joi.string()
        .empty("")
        .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
        .label("User Role ID")
        .messages({ "string.pattern.base": "Invalid User Role Id" }),
    });
    let validateResult = schema.validate(request);
    if (validateResult.error) {
      return res
        .status(400)
        .send(ApiResponse.getError(validateResult.error.details[0].message));
    }

    let selectedUser = await userModel.findOne({
      _id: mongoose.Types.ObjectId(userId),
      isFinal: true,
    });
    if (!selectedUser)
      return res.status(400).send(ApiResponse.getError("User not found"));

    selectedUser.isFinal = false;
    selectedUser = selectedUser.toJSON();
    delete selectedUser._id;
    selectedUser.editedDate = new Date(Date() + "UTC");
    let oldUserEntry = await userModel.create(selectedUser);
    if (!oldUserEntry)
      return res.status(400).send(ApiResponse.getError("Something went wrong"));

    selectedUser.isFinal = true;
    delete selectedUser.editedDate;
    if (!(request.firstName === "" || request.firstName === null))
      selectedUser.firstName = request.firstName;
    if (!(request.lastName === "" || request.lastName === null))
      selectedUser.lastName = request.lastName;
    if (!(request.email === "" || request.email === null))
      selectedUser.email = request.email;
    if (!(request.contactNumber === "" || request.contactNumber === null))
      selectedUser.contactNumber = request.contactNumber;
    selectedUser.extension = request.extension;
    if (!(request.departmentId === "" || request.departmentId === null))
      selectedUser.departmentId = request.departmentId;
    if (!(request.employeeNumber === "" || request.employeeNumber === null))
      selectedUser.employeeNumber = request.employeeNumber;
    if (!(request.userName === "" || request.userName === null))
      selectedUser.userName = request.userName;

    if (
      !(request.currentPassword === "" || request.currentPassword === null) &&
      !(await bcrypt.compare(request.currentPassword, selectedUser.password))
    ) {
      return res
        .status(401)
        .send(ApiResponse.getError("Invalid Current Password"));
    }
    if (
      (request.password === "" || request.password === null) &&
      (await bcrypt.compare(request.currentPassword, selectedUser.password))
    )
      return res
        .status(401)
        .send(ApiResponse.getError("Password con not be Empty"));

    if (!(request.password === "" || request.password === null)) {
      const salt = await bcrypt.genSalt(10);
      selectedUser.password = await bcrypt.hash(request.password, salt);
    }
    if (!(request.roleId === "" || request.roleId === null))
      selectedUser.roleId = request.roleId;

    let updatedUser = await userModel.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(userId) },
      {
        $set: selectedUser,
      },
      { new: true }
    );

    let role = await userRoleModel.findOne(
      { _id: updatedUser.roleId },
      { _id: 0, __v: 0 }
    );
    if (!role) {
      return res.status(400).send(ApiResponse.getError("Something went wrong"));
    }

    let userData = { ...updatedUser.toJSON(), ...role.toJSON() };
    delete userData.password;

    if (userData) {
      return res.status(200).send(
        ApiResponse.getSuccess({
          details: userData,
          token: jwt.sign(
            {
              _id: userData._id,
              roleName: userData.roleName,
              accessLevel: userData.accessLevel,
            },
            process.env.secretKey
          ),
        })
      );
    }
    return res.status(400).send(ApiResponse.getError("Something went wrong"));
  },

  /// get method
  /// send otp to user email
  /// not authenticate
  async sendOTP(req, res) {
    let request = req.query;

    const schema = Joi.object({
      userName: Joi.string()
        .required()
        .regex(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "xxx@xx.xx",
          ""
        )
        .label("Email"),
    });
    let validateResult = schema.validate(request);
    if (validateResult.error) {
      return res
        .status(400)
        .send(ApiResponse.getError(validateResult.error.details[0].message));
    }

    let user = await userModel.findOne({
      $and: [
        { $or: [{ userName: request.userName }, { email: request.userName }] },
        { isFinal: true },
        {
          $or: [
            { userStatues: stringContent.userStatuesObj.pending },
            { userStatues: stringContent.userStatuesObj.active },
            { userStatues: stringContent.userStatuesObj.reject },
          ],
        },
      ],
    });
    if (!user) {
      return res.status(401).send(ApiResponse.getError("User Not Found"));
    }

    let otp = OTP.getOTP();

    let updatedUser = await userModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(user._id), isFinal: true },
      {
        $set: { passwordResetCode: otp },
      },
      { new: true }
    );
    if (!updatedUser)
      return res.status(400).send(ApiResponse.getError("Something went wrong"));

    let htmlTemplate = getOTPTemplate(user.firstName, otp);
    axios({
      method: "post",
      url: "https://api.sendgrid.com/v3/mail/send",
      headers: {
        authorization: "Bearer " + process.env.sendGridKey,
        "content-type": "application/json",
      },
      data: {
        personalizations: [
          {
            to: [
              {
                email: user.email,
                name: user.firstName,
              },
            ],
            subject: "OMMS - OTP",
          },
        ],
        content: [
          {
            type: "text/html",
            value: htmlTemplate,
            // "<html><head></head><body>Click <a href='" +
            // process.env.resetPasswordBaseUrl +
            // "?email=" +
            // request.email +
            // "&code=" +
            // resetPassword +
            // "' >here</a> to reset password.</body></html>",
          },
        ],
        from: { email: "info@igrs.lk", name: "OMMS" },
        reply_to: { email: "info@igrs.lk", name: "OMMS" },
      },
    })
      .then(function (response) {
        return res
          .status(200)
          .send(ApiResponse.getSuccess("Successfully updated"));
      })
      .catch(function (error) {
        console.log(error.response.data.errors);
        return res
          .status(400)
          .send(ApiResponse.getError("Error during sending email"));
      });
  },

  /// post method
  /// update user password
  /// not authenticate
  /// update password comparing otp
  async resetPassword(req, res) {
    let request = req.body;

    const schema = Joi.object({
      userEmail: Joi.string()
        .empty("")
        .regex(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "xxx@xx.xx",
          ""
        )
        .label("User Email"),
      otp: Joi.number().allow(null).label("OTP"),
      newPassword: Joi.string().empty("").label("New Password"),
    });

    let user = await userModel.findOne({
      $and: [
        { email: request.userEmail },
        { isFinal: true },
        {
          $or: [
            { userStatues: stringContent.userStatuesObj.pending },
            { userStatues: stringContent.userStatuesObj.active },
            { userStatues: stringContent.userStatuesObj.reject },
          ],
        },
      ],
    });
    if (!user) {
      return res.status(401).send(ApiResponse.getError("User Not Found"));
    }

    if (user.passwordResetCode !== request.otp)
      return res.status(401).send(ApiResponse.getError("Invalid OTP"));

    const salt = await bcrypt.genSalt(10);
    let password = await bcrypt.hash(request.newPassword, salt);
    let updatedUser = await userModel.findOneAndUpdate(
      { email: request.userEmail, isFinal: true },
      {
        $set: { password: password, passwordResetCode: 0 },
      },
      { new: true }
    );

    if (updatedUser)
      return res
        .status(200)
        .send(ApiResponse.getSuccess("Successfully Updated"));
    return res.status(400).send(ApiResponse.getError("Something Went Wrong"));
  },

  /// post method
  /// return total user count(not include deleted users) & statues vice count
  /// allow to access all users
  /// if not any filter return summery of all users
  // async userSummerCount(req, res) {
  //   let request = req.body;

  //   const schema = Joi.object({
  //     startDate: Joi.date().empty("").label("Start Date"),
  //     endDate: Joi.date().empty("").label("End Date"),
  //   });
  //   let validateResult = schema.validate(request);
  //   if (validateResult.error) {
  //     return res
  //       .status(400)
  //       .send(ApiResponse.getError(validateResult.error.details[0].message));
  //   }

  //   condition = {
  //     $and: [
  //       request.startDate === "" ||
  //       request.startDate === null ||
  //       !request.startDate
  //         ? {}
  //         : { $and: [{ date: { $gte: new Date(request.startDate) } }] },
  //       request.endDate === "" || request.endDate === null || !request.endDate
  //         ? {}
  //         : { $and: [{ date: { $lt: new Date(request.endDate) } }] },
  //       { isFinal: true },
  //     ],
  //   };

  //   let totalRequestCount = await requestModel.aggregate([
  //     { $match: condition },
  //     {
  //       $group: {
  //         _id: null,
  //         count: { $sum: 1 },
  //       },
  //     },
  //   ]);

  //   let requestStatuesCount = await requestModel.aggregate([
  //     { $match: condition },
  //     {
  //       $lookup: {
  //         from: "request_updates",
  //         let: {
  //           requestId: "$_id",
  //         },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $eq: ["$requestId", "$$requestId"] },
  //                   { $eq: ["$isCurrentStatues", true] },
  //                 ],
  //               },
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: "request_statues",
  //               localField: "statuesId",
  //               foreignField: "_id",
  //               as: "requestStatues",
  //             },
  //           },
  //           { $unwind: "$requestStatues" },
  //         ],
  //         as: "finalUpdate",
  //       },
  //     },
  //     { $unwind: "$finalUpdate" },
  //     {
  //       $group: {
  //         _id: "$finalUpdate.requestStatues.statues",
  //         count: { $sum: 1 },
  //       },
  //     },
  //     // {
  //     //   $group: {
  //     //     _id: "",
  //     //     data: {
  //     //       $mergeObjects: {
  //     //         $arrayToObject: [
  //     //           [
  //     //             {
  //     //               k: {
  //     //                 $toString: "$_id",
  //     //               },
  //     //               v: {
  //     //                 $toInt: "$count",
  //     //               },
  //     //             },
  //     //           ],
  //     //         ],
  //     //       },
  //     //     },
  //     //   },
  //     // },
  //     // {
  //     //   $replaceRoot: {
  //     //     newRoot: "$data",
  //     //   },
  //     // },
  //   ]);

  //   if (!totalRequestCount && !requestStatuesCount)
  //     return res.status(400).send(ApiResponse.getError("Something went wrong"));

  //   return res.status(200).send(
  //     ApiResponse.getSuccess({
  //       totalRequestCount: totalRequestCount[0]
  //         ? totalRequestCount[0].count
  //         : 0,
  //       requestStatuesCount: requestStatuesCount,
  //     })
  //   );
  // },
};
