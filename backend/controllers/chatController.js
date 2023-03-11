const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

//responsible for creating and fetching chat one on one

const accessChat = asyncHandler(async (req, res) => {
  //take the user id,
  // with which we are going to create the chat

  const { userId } = req.body;
  console.log(userId);

  if (!userId) {
    console.log('UserId param not sent with request ');
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    // $and: [
    //   { users: { $eleMatch: { $eq: req.user._id } } },
    //   { users: { $eleMatch: { $eq: userId } } },
    // ],
    users: { $all: [req.user._id, userId] },
  })
    .populate('users', '-password')
    .populate('latestMessage');

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name pic email',
  });

  //if chat exists, send the chat otherwise create a new chat
  if (isChat.length > 0) {
    res.send(isChat[0]);
    //bcoz only one chat will exist b/w these two users
  } else {
    var chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        'users',
        '-password'
      );

      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  //check which user is logged in , and query the chats for that user in the db
  //then populate the things returned from it.

  try {
    const user = req.user._id;
    // console.log(user);
    Chat.find({ users: { $in: [user] } })
      .populate('users', '-password')
      .populate('latestMessage')
      .populate('groupAdmin', '-password')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: 'latestMessage.sender',
          select: 'name pic email',
        });

        res.status(200).send(results);
      });
  } catch (error) {
    res.status(401);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || req.body.name) {
    return res.status(400).send({ message: 'Pls fill all the fields! ' });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    res.status(400).send('More than 2 users are required to form a group chat');
  }

  //group should also contain current user
  users.push(req.user);
});

module.exports = { accessChat, fetchChats, createGroupChat };
