const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const appError = require("../utils/appError.utils");

const loginService = async (email, password) => {
  if (!email || !password) {
    appError("require details not found", 400);
  }
  const user = await User.findOne({ where: { email } });
  if (!user) {
    appError("Invalid Credentials", 400);
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    appError("Invalid Credentials", 500);
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  return token;
};

const registerService = async (username, email, password, role) => {
  if (!username || !email || !password || !role) {
    appError("All fields are required", 400);
  }
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    appError("User already exists", 400);
  }

  const hashPassword = bcrypt.hashSync(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashPassword,
    role,
  });

  const token = jwt.sign(
    { id: newUser.id, role: newUser.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  return token;
};

module.exports = { loginService, registerService };
