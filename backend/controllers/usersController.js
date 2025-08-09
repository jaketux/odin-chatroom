require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("../prisma.ts");

const jwt = require("jsonwebtoken");

async function loginUser(req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        password: true,
        friendships: true,
        friendOf: true,
        chats: true,
        sentFriendRequests: true,
        receivedFriendRequests: true,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password.hash))) {
      return res.status(401).json({ error: "Invalid login credentials." });
    }

    jwt.sign(
      {
        sub: user.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) {
          return res.status(500).json({ error: "Token generation failed" });
        }
        const { password: _, ...userWithoutPassword } = user;
        return res.json({ token, user: userWithoutPassword });
      }
    );
  } catch (error) {
    console.error("Login error: " + error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function createUser(req, res) {
  const { username, password, email, firstname, lastname, profilepicture } =
    req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        password: {
          create: {
            hash: hashedPassword,
          },
        },
        email,
        firstname,
        lastname,
        profilepicture,
      },
    });
    return res.json(newUser);
  } catch (error) {
    console.error("Error received when creating user: " + error);
  }
}

async function getUser(req, res) {
  jwt.verify(req.token, "chatroom", async (error, authData) => {
    if (error) {
      console.error("Error received when verifying the bearer token: " + error);
      res.status(403).json({ error: "Error when verifying the bearer token" });
    } else {
      try {
        const tokenUserId = authData.sub;

        const userProfile = await prisma.user.findUnique({
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
        return res.json(userProfile);
      } catch (error) {
        res
          .status(404)
          .json({ error: "No profile found matching this user ID" });
      }
    }
  });
}

async function updateUser(req, res) {
  const { username, email, firstname, lastname, profilepicture } = req.body;

  jwt.verify(req.token, "chatroom", async (error, authData) => {
    if (error) {
      console.error("Error received when verifying the bearer token: " + error);
      res.status(403).json({ error: "Error when verifying the bearer token." });
    } else {
      try {
        const tokenUserId = authData.sub;

        const updatedUser = await prisma.user.update({
          where: {
            id: tokenUserId,
          },
          data: {
            username,
            email,
            firstname,
            lastname,
            profilepicture,
          },
          include: {
            friendships: true,
            friendOf: true,
            chats: true,
            sentFriendRequests: true,
            receivedFriendRequests: true,
          },
        });

        return res.json(updatedUser);
      } catch (error) {
        console.error("Error received when updating user: " + error);
      }
    }
  });
}

module.exports = {
  loginUser,
  createUser,
  getUser,
  updateUser,
};
