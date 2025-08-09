require("dotenv").config();
const prisma = require("../prisma.ts");

const jwt = require("jsonwebtoken");

async function deleteFriend(req, res) {
  jwt.verify(req.token, "chatroom", async (error, authData) => {
    if (error) {
      console.error("Error when verifying bearer token: " + error);
      res.status(403).json({ error: "Error when verifying bearer token" });
    } else {
      try {
        const tokenUserId = authData.sub;

        const friendshipId = parseInt(req.params.friendshipid);

        const deletedFriend = await prisma.friendListEntry.deleteMany({
          where: {
            AND: [
              { id: friendshipId },
              {
                OR: [
                  {
                    userId: tokenUserId,
                  },
                  { friendId: tokenUserId },
                ],
              },
            ],
          },
        });

        if (!deletedFriend) {
          return res
            .status(403)
            .json({ error: "Unable to find a friend matching those details." });
        }

        const updatedUser = await prisma.user.findUnique({
          where: {
            id: tokenUserId,
          },
          include: {
            chats: true,
            friendships: true,
            friendOf: true,
            sentFriendRequests: true,
            receivedFriendRequests: true,
          },
        });

        return res.json(updatedUser);
      } catch (error) {
        console.error("Error when deleting friend. " + error);
      }
    }
  });
}

module.exports = { deleteFriend };
