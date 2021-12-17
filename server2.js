require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());
const PORT = process.env.PORT || 5002;
var privateKey = fs.readFileSync("private.key");
var publicKey = fs.readFileSync("public.key");

const users = [
  { id: 1, username: "Vivek", title: "Software Engineer" },
  {
    id: 2,
    username: "Bhargav",
    title: "Software Engineer",
  },
];

app.get("/users", authenticateToken, (req, res) => {
  res.json(users.filter((user) => user.username === req.user.name));
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = { name: username };

  if (username && password) {
    const accessToken = jwt.sign(user, privateKey, {
      issuer: "Vivek R",
      subject: "vivek@test.com",
      audience: "test",
      expiresIn: "10h",
      algorithm: "RS256",
    });
    res.status(201).json({ accessToken: accessToken });
  } else {
    res.status(400).json({ message: "Enter your username and password" });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, publicKey, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
