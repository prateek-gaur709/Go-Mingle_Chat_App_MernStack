const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/generateToken');
//express-async-handler package handles the errors in this controller
const User = require('../models/userModel');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Pls enter all the fields! ');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists!!');
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Failed to create the user!');
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.sendStatus(400);
    throw new Error('Pls enter all the fields!!');
  }

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password!!!');
  }
});

//search user api
// /api/user/

//we can send the data to backend by-
// 1. using req.body via post request
//2. using queries.(does not rquires post request)
//  ex. /api/user?variable=value
// Here...   /api/user?search=prateek

//B - to take a param from api url
//  /api/chat/:id ==> req.param.id  (req.param.name_of_that_param)
//  /api/user?search=prateek    ==> req.query.search  (req.query.name_of_that_query)

//operators in mongoose- see docs for $or, $and, $nor, $in, $ne
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          {
            name: { $regex: req.query.search, $options: 'i' },
            email: { $regex: req.query.search, $options: 'i' },
          },
        ],
      }
    : {};
  // console.log(keyword);

  //auth middleware for granting the access to current logged in user id

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }); //except the current logged in user
  res.send(users);
});

module.exports = { registerUser, authUser, allUsers };
