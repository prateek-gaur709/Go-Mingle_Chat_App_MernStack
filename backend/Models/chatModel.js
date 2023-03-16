//chatName
//isGroupChat
//users
//latestMessage
//groupAdmin

const mongoose = require('mongoose');

const chatSchema = {
  chatName: { type: String, trim: true, required: true },
  isGroupChat: { type: Boolean, default: false },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
    },
  ],
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
};
const chatModel = mongoose.Schema(chatSchema, { timestamps: true });

const Chat = mongoose.model('Chat', chatModel);

module.exports = Chat;
