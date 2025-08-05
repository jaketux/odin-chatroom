const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const bcrypt = require("bcryptjs");

const usersRouter = require("./routes/usersRouter");
const friendRequestRouter = require("./routes/usersRouter");
const chatRouter = require("./routes/chatRouter");

app.use("/users", usersRouter);
app.use("/friendrequests", friendRequestRouter);
app.use("/chats", chatRouter);

app.listen(5000, () => {
  console.log(`Express app listening on port 5000`);
});
