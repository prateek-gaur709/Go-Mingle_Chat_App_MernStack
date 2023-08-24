const asyncHandler = require('express-async-handler');
const Chat = require('../Models/chatModel');
const User = require('../Models/userModel');

//responsible for creating and fetching chat one on one

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected

const accessChat = asyncHandler(async (req, res) => {
  //take the user id,
  // with which we are going to create the chat

  const { userId } = req.body;
  // console.log(userId);

  if (!userId) {
    console.log('UserId param not sent with request ');
    return res.sendStatus(400);
  }

  //u can use this also in place of $all

  //  $and: [
  //       { users: { $eleMatch: { $eq: req.user._id } } },
  //       { users: { $eleMatch: { $eq: userId } } },
  //     ],
  try {
    var isChat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] },
    })
      .populate('users', '-password')
      .populate('latestMessage')
      .populate({
        path: 'latestMessage.sender',
        select: 'name pic email',
      });

    //if chat exists, send the chat otherwise create a new chat
    if (isChat) {
      console.log(isChat);
      res.send(isChat);
      return;
      //bcoz only one chat will exist b/w these two users
    }
    var chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findById(createdChat._id).populate(
      'users',
      '-password'
    );

    res.status(200).send(fullChat);
  } catch (error) {
    res.status(401).send(error.message);
    // throw new Error(error.message);
  }
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
  //check which user is logged in , and query the chats for that user in the db
  //then populate the things returned from it.

  try {
    const user = req.user._id;
    // console.log(user);
    var results = await Chat.find({ users: user })
      .populate('users', '-password')
      .populate('latestMessage')
      .populate('groupAdmin', '-password')
      .sort({ updatedAt: -1 });

    var populatedResults = await User.populate(results, {
      path: 'latestMessage.sender',
      select: 'name pic email',
    });

    res.status(200).send(populatedResults);
  } catch (error) {
    res.status(401).send(error.message);
    // throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: 'Please Fill all the feilds' });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send('More than 2 users are required to form a group chat');
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    });

    console.log(users.length);

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    console.log(users.length);

    res.status(200).json(fullGroupChat);
    console.log(users.length);
  } catch (error) {
    console.log('mera');
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  ).populate([
    { path: 'users', select: '-password' },
    { path: 'groupAdmin', select: '-password' },
  ]);

  if (!updatedChat) {
    res.status(404);
    throw new Error('Chat not found!! ');
  } else {
    // console.log(chatName);
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  ).populate([
    { path: 'users', select: '-password' },
    { path: 'groupAdmin', select: '-password' },
  ]);

  if (added) {
    res.json(added);
  } else {
    res.status(404);
    throw new Error(error.message);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  ).populate([
    { path: 'users', select: '-password' },
    { path: 'groupAdmin', select: '-password' },
  ]);

  if (removed) {
    res.json(removed);
  } else {
    res.status(404);
    throw new Error(error.message);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
