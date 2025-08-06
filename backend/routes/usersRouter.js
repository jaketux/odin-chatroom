const prisma = require("../prisma.ts");

const { Router } = require("express");

const usersController = require("../controllers/usersController.js");

const usersRouter = Router();

const verifyToken = require("../middleware/authMiddleware.js");

usersRouter.post("/", usersController.createUser);
usersRouter.post("/login", usersController.loginUser);
usersRouter.get("/", usersController.getUser);
usersRouter.put("/", usersController.updateUser);

module.exports = usersRouter;
