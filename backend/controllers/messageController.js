const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log('Invalid data passes into request!');
    res.status(400);
  }

  try {
    //post request h..

    var message = await Message.create({
      sender: req.user._id,
      content: content,
      chat: chatId,
    }); //create document

    //we are gonna populate content inside this message,
    message = await message.populate('sender', 'name pic');
    message = await message.populate('chat');

    //message document k andr hi , chat k andr k users ko populate krna ab
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name pic email',
    });

    //findbyIdandUpdate the latestMessage

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  //querying the db
  try {
    const messages = await Message.find({
      chat: req.params.chatId,
    })
      .populate('sender', 'name pic email')
      .populate('chat');

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
