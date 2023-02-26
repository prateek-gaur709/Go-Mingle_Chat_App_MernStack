const express = require('express');
const dotenv = require('dotenv');
const { chats } = require('./data/data');
var cors = require('cors');

const app = express();
app.use(cors());

dotenv.config();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send(`App is running on port ${PORT}`);
});

app.get('/api/chat', (req, res) => {
  res.send(chats);
});

app.get('/api/chat/:id', (req, res) => {
  // console.log(req.params.id);
  res.send(chats.find((ele) => ele._id === req.params.id));
});

app.listen(PORT, 'localhost', () => {
  console.log(`Server has started on PORT ${PORT}`);
});
