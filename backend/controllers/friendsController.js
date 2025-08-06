require("dotenv").config();
const prisma = require("../prisma.ts");

const jwt = require("jsonwebtoken");

async function deleteFriend(req, res) {
  const friendId = req.params.friendid;

  jwt.verify(req.token, "chatroom", async (error, authData) => {
    if (error) {
      console.error("Error when verifying bearer token: " + error);
      res.status(403).json({ error: "Error when verifying bearer token" });
    } else {
      try {
        const tokenUserId = authData.sub;

        //need to check to see how this works if the params are reversed
        const deletedFriend = await prisma.friendlistentry.delete({
          where: {
            userId: tokenUserId,
            friendId: friendId,
          },
        });

        const updatedUser = await prisma.user.findUnique({
          where: {
            id: tokenUserId,
          },
        });

        return res.json(updatedUser);
      } catch (error) {
        console.error("Error when deleting friend. ");
      }
    }
  });
}

module.exports = { deleteFriend };
