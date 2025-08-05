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

module.exports = {
  loginUser,
};
