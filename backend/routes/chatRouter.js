const prisma = require("../prisma.ts");

const { Router } = require("express");

const chatController = require("../controllers/chatController.js");

const chatRouter = Router();

const verifyToken = require("../middleware/authMiddleware.js");

chatRouter.get("/", verifyToken, chatController.getAllChats);
chatRouter.get("/:chatid", verifyToken, chatController.getChat);
chatRouter.post("/", verifyToken, chatController.createChat);
chatRouter.post("/:chatid", verifyToken, chatController.createMessage);

module.exports = chatRouter;
