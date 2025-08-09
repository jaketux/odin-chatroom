require("dotenv").config();

const prisma = require("../prisma.ts");

const jwt = require("jsonwebtoken");

async function getFriendRequests(req, res) {
  jwt.verify(req.token, "chatroom", async (error, authData) => {
    if (error) {
      console.error("Error received when verifying the bearer token: " + error);
      res.status(403).json({ error: "Error when verifying the bearer token" });
    } else {
      try {
        const tokenUserId = authData.sub;

        const sentRequests = await prisma.friendRequest.findMany({
          where: {
            senderId: tokenUserId,
          },
        });

        const receivedRequests = await prisma.friendRequest.findMany({
          where: {
            receiverId: tokenUserId,
          },
        });

        return res.json({
          sentRequests: sentRequests,
          receivedRequests: receivedRequests,
        });
      } catch (error) {
        console.error("Error received when retrieving friend requests");
      }
    }
  });
}

async function createFriendRequest(req, res) {
  const { requestedUsername } = req.body;
  jwt.verify(req.token, "chatroom", async (error, authData) => {
    if (error) {
      console.error("Error received when verifying bearer token: " + error);
      res.status(403).json({ error: "Error when verifying the bearer token" });
    } else {
      try {
        const tokenUserId = authData.sub;

        const requestedUser = await prisma.user.findUnique({
          where: {
            username: requestedUsername,
          },
        });

        const newFriendRequest = await prisma.friendRequest.create({
          data: {
            senderId: tokenUserId,
            receiverId: requestedUser.id,
          },
        });

        const sentRequests = await prisma.friendRequest.findMany({
          where: {
            senderId: tokenUserId,
          },
        });

        const receivedRequests = await prisma.friendRequest.findMany({
          where: {
            receiverId: tokenUserId,
          },
        });

        return res.json({
          sentRequests: sentRequests,
          receivedRequests: receivedRequests,
        });
      } catch (error) {
        console.error("Error when creating friend request: " + error);
      }
    }
  });
}

async function updateFriendRequest(req, res) {
  const { update } = req.body;

  jwt.verify(req.token, "chatroom", async (error, authData) => {
    if (error) {
      console.error("Error when verifying bearer token: " + error);
      res.status(403).json({ error: "Error when verifying bearer token" });
    } else {
      try {
        const requestId = parseInt(req.params.friendrequestid);

        const tokenUserId = authData.sub;

        const requestToUpdate = await prisma.friendRequest.findUnique({
          where: {
            id: requestId,
          },
        });

        if (requestToUpdate.receiverId !== tokenUserId) {
          return res.status(403).json({
            error: "Unable to update friend requests for other users.",
          });
        }

        const updatedRequest = await prisma.friendRequest.update({
          where: {
            id: requestId,
          },
          data: {
            status: update,
          },
        });

        if (update === "ACCEPTED") {
          const newFriendListEntry = await prisma.friendListEntry.create({
            data: {
              userId: requestToUpdate.senderId,
              friendId: requestToUpdate.receiverId,
            },
          });
        }

        const sentRequests = await prisma.friendRequest.findMany({
          where: {
            senderId: tokenUserId,
          },
        });

        const receivedRequests = await prisma.friendRequest.findMany({
          where: {
            receiverId: tokenUserId,
          },
        });

        const updatedUser = await prisma.user.findUnique({
          where: {
            id: tokenUserId,
          },
          include: {
            friendships: true,
            friendOf: true,
            sentFriendRequests: true,
            receivedFriendRequests: true,
            chats: true,
          },
        });

        return res.json({
          sentRequests: sentRequests,
          receivedRequests: receivedRequests,
          updatedUser: updatedUser,
        });
      } catch (error) {
        console.error("Error received when updating Friend Request: " + error);
      }
    }
  });
}

async function deleteFriendRequest(req, res) {
  jwt.verify(req.token, "chatroom", async (error, authData) => {
    if (error) {
      console.error("Error received when verifying bearer token: " + error);
      res
        .status(403)
        .json({ error: "Error received when verifying bearer token" });
    } else {
      try {
        const tokenUserId = authData.sub;
        const requestId = parseInt(req.params.friendrequestid);

        const friendRequest = await prisma.friendRequest.findUnique({
          where: {
            id: requestId,
          },
        });

        if (friendRequest.senderId !== tokenUserId) {
          return res
            .status(403)
            .json({ error: "Cannot delete friend requests for other users." });
        }

        const deletedRequest = await prisma.friendRequest.delete({
          where: {
            id: requestId,
          },
        });

        const updatedUser = await prisma.user.findUnique({
          where: {
            id: tokenUserId,
          },
          include: {
            friendships: true,
            friendOf: true,
            sentFriendRequests: true,
            receivedFriendRequests: true,
            chats: true,
          },
        });

        const sentRequests = await prisma.friendRequest.findMany({
          where: {
            senderId: tokenUserId,
          },
        });

        const receivedRequests = await prisma.friendRequest.findMany({
          where: {
            receiverId: tokenUserId,
          },
        });

        return res.json({
          sentRequests: sentRequests,
          receivedRequests: receivedRequests,
          updatedUser: updatedUser,
        });
      } catch (error) {
        console.error("Error when deleting friend request");
      }
    }
  });
}

module.exports = {
  getFriendRequests,
  createFriendRequest,
  updateFriendRequest,
  deleteFriendRequest,
};
