require("dotenv").config();

const prisma = require("../prisma.ts");

const jwt = require("jsonwebtoken");

async function getAllChats(req, res) {
  jwt.verify(req.token, "chatroom", async (error, authData) => {
    if (error) {
      console.error("Error when validating bearer token: " + error);
      res.status(403).json({ error: "Error when validating bearer token" });
    } else {
      try {
        const tokenUserId = authData.sub;

        const allChats = await prisma.chat.findMany({
          include: {
            users: {
              where: {
                id: tokenUserId,
              },
            },
          },
        });

        res.json(allChats);
      } catch (error) {
        console.error("Error when getting all chats");
      }
    }
  });
}

async function getChat(req, res) {
  const chatId = req.params.chatid;

  jwt.verify(req.token, "chatroom", async (error, authData) => {
    if (error) {
      console.error("Error when validating bearer token: " + error);
      res.status(403).json({ error: "Error when validating bearer token." });
    } else {
      try {
        const tokenUserId = authData.sub;

        const foundChat = await prisma.chat.findUnique({
          where: {
            id: chatId,
          },
          include: {
            users: true,
          },
        });

        const searchedUsers = foundChat.users.find(
          (user) => user.id === tokenUserId
        );

        if (!searchedUsers) {
          return res
            .status(404)
            .json({ error: "Cannot access chats of other users. " });
        }

        return res.json(foundChat);
      } catch (error) {
        console.error("Error when getting specific chat.");
      }
    }
  });
}

async function createChat(req, res) {
  const { name, usernames } = req.body;

  jwt.verify(req.token, "chatroom", async (error, authData) => {
    if (error) {
      console.error("Error when validating bearer token: " + error);
      res.status(403).json({ error: "Error when validating bearer token." });
    } else {
      try {
        const tokenUserId = authData.sub;

        const result =
          await prisma.$queryRaw`SELECT * FROM User WHERE username IN (${Prisma.join(
            usernames
          )})`;

        if (result.length !== usernames.length) {
          return res
            .status(403)
            .json({ error: "One or more usernames does not exist." });
        }

        const searchedUsers = result.find((user) => user.id === tokenUserId);

        if (!searchedUsers) {
          return res
            .status(404)
            .json({ error: "Cannot create chats for other users. " });
        }

        const newChat = await prisma.chat.create({
          data: {
            name: name,
            users: result,
          },
        });

        return res.json(newChat);
      } catch (error) {
        console.error("Error when creating new chat");
      }
    }
  });
}

async function createMessage(req, res) {
  const { content } = req.body;
  const chatId = req.params.chatid;

  jwt.verify(req.token, "chatroom", async (error, authData) => {
    if (error) {
      console.error("Error when verifying bearer token: " + error);
      res.status(403).json({ error: "Error when verifying bearer token" });
    } else {
      try {
        const tokenUserId = authData.sub;

        const createdMessage = await prisma.message.create({
          data: {
            userId: tokenUserId,
            chatId: chatId,
            content: content,
          },
        });

        const updatedChat = await prisma.chat.findUnique({
          where: {
            id: chatId,
          },
        });

        return res.json(updatedChat);
      } catch (error) {
        console.error("Error when creating new message.");
      }
    }
  });
}

module.exports = {
  getAllChats,
  getChat,
  createChat,
  createMessage,
};
