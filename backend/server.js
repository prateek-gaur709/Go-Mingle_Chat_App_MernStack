const express = require('express');
const dotenv = require('dotenv');
var cors = require('cors'); //for proxy config
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const path = require('path');

const app = express();
app.use(cors());

dotenv.config();

//to accept json data from frontend to backend
app.use(express.json());

//database connection
connectDB();

// app.get('/', (req, res) => {
//   res.send(`App is running on port ${PORT}`);
// });

//get post methods in userroute folder, then use-- app.use()
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname1, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running..');
  });
}

// --------------------------deployment------------------------------

//error handling routes: middlewares for unknown routes to display proper messages.

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server has started on PORT ${PORT}`.white.bold)
);

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  console.log(`connected to socket.io `);

  //create logged in user room

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log(userData._id, userData.name);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log(`User joined the room: `.bgBlue + room);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageReceived) => {
    console.log('Received new message:', newMessageReceived);

    var chat = newMessageReceived.chat;
    console.log('Chat:', chat);
    console.log('Chat users:', chat.users);

    if (!chat || !chat.users) {
      console.log('Chat or chat.users not defined');
      return;
    }

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit('message received', newMessageReceived);
    });
  });

  socket.off('setup', () => {
    console.log('USER DISCONNECTED!');
    socket.leave(userData._id);
  });
});

// console.log('khud ko msg nhi gya hai..other person in room ko gya h..');
//"in" means inside that users room, emit/send the message
