const prisma = require("../prisma.ts");

const { Router } = require("express");

const chatController = require("../controllers/chatController.js");

const chatRouter = Router();

const verifyToken = require("../middleware/authMiddleware.js");

chatRouter.get("/", chatController.getAllChats);
chatRouter.get("/:chatid", chatController.getChat);
chatRouter.post("/", chatController.createChat);
chatRouter.post("/:chatid", chatController.createMessage);

module.exports = chatRouter;
