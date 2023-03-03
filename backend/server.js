const express = require('express');
const dotenv = require('dotenv');
const { chats } = require('./data/data');
var cors = require('cors'); //for proxy config
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());

dotenv.config();
const PORT = process.env.PORT || 5000;

//to accept json data from frontend to backend
app.use(express.json());

//database connection
connectDB();

app.get('/', (req, res) => {
  res.send(`App is running on port ${PORT}`);
});

//get post methods in userroute folder, then use-- app.use()
app.use('/api/user', userRoutes);

//error handling routes:

app.use(notFound);
app.use(errorHandler);

// app.get('/api/chat', (req, res) => {
//   res.send(chats);
// });

// app.get('/api/chat/:id', (req, res) => {
//   // console.log(req.params.id);
//   res.send(chats.find((ele) => ele._id === req.params.id));
// });

app.listen(PORT, 'localhost', () => {
  console.log(`Server has started on PORT ${PORT}`.white.bold);
});
