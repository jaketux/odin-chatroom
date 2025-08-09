const prisma = require("../prisma.ts");

const { Router } = require("express");

const friendsController = require("../controllers/friendsController.js");

const friendsRouter = Router();

const verifyToken = require("../middleware/authMiddleware.js");

friendsRouter.delete(
  "/:friendshipid",
  verifyToken,
  friendsController.deleteFriend
);

module.exports = friendsRouter;
