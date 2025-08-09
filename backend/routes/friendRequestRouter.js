const prisma = require("../prisma.ts");

const { Router } = require("express");

const friendRequestController = require("../controllers/friendRequestController.js");

const friendRequestRouter = Router();

const verifyToken = require("../middleware/authMiddleware.js");

friendRequestRouter.get(
  "/",
  verifyToken,
  friendRequestController.getFriendRequests
);

friendRequestRouter.post(
  "/",
  verifyToken,
  friendRequestController.createFriendRequest
);

friendRequestRouter.patch(
  "/:friendrequestid",
  verifyToken,
  friendRequestController.updateFriendRequest
);

friendRequestRouter.delete(
  "/:friendrequestid",
  verifyToken,
  friendRequestController.deleteFriendRequest
);

module.exports = friendRequestRouter;
