const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const prisma = require("../prisma");

// @desc Register new user
// @route POST /api/users
// @access Public
const signupUser = asyncHandler(async (req, res) => {
  const { fname, lname, email, password, address, phone_number } = req.body;

  if (!fname || !lname || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields.");
  }

  //Check if user exists.
  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });

  const userExists = !!user;

  if (userExists) {
    res.status(400);
    throw new Error("User exists.");
  }

  //Hash Password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    // Create User
    const newUser = await prisma.users.create({
      data: {
        fname: fname,
        lname: lname,
        email: email,
        password: hashedPassword,
        address: address || null,
        phone_number: phone_number || null,
      },
      select: {
        user_id: true,
        fname: true,
        lname: true,
        email: true,
      },
    });

    const token = generateToken(newUser.user_id);

    res.status(201).json({ ...newUser, token });
  } catch (error) {
    res.status(400);
    throw new Error(error + "Invalid user data.");
  }
});

// @desc Authenticate a user
// @route POST /api/users/signin
// @access Public
const signinUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      user_id: user.user_id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      token: generateToken(user.user_id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

// @desc Get user data
// @route GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  console.log(req.user);
  const { user_id, fname, lname, email, phone_number, address } =
    await prisma.users.findUnique({
      where: {
        user_id: req.user.user_id,
      },
    });

  res.status(200).json({
    user_id: user_id,
    fname: fname,
    lname: lname,
    email: email,
    phone_number: phone_number,
    address: address,
  });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = {
  signupUser,
  signinUser,
  getMe,
};
