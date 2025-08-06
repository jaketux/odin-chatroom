const prisma = require("../prisma.ts");

const { Router } = require("express");

const friendRequestRouter = Router();

const friendRequestController = require("../controllers/friendRequestController.js");

friendRequestRouter.get("/", friendRequestController.getFriendRequests);
friendRequestRouter.post("/", friendRequestController.createFriendRequest);
friendRequestRouter.patch(
  "/:friendrequestid",
  friendRequestController.updateFriendRequest
);
friendRequestRouter.delete(
  "/:friendrequestid",
  friendRequestController.deleteFriendRequest
);

module.exports = friendRequestRouter;
