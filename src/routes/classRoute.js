const express = require("express");
const classController = require("../controllers/classController");
const { authenticateUser } = require("../config/auth");

const classRouter = express.Router();


classRouter.post("/class/register", authenticateUser, classController.registerClass);
classRouter.get("/classes", classController.getAllClass);
classRouter.get("/class/:className/students", authenticateUser, classController.getStudentByClass);



module.exports = classRouter;