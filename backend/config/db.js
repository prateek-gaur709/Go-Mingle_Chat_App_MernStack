const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'talk-A-Little',
      useNewURLParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `MongoDB Connected : ${conn.connection.host}`.yellow.underline.bold
    );
  } catch (error) {
    console.log(`Error : ${error.message}`.red.bold);
    process.exit();
  }
};

module.exports = connectDB;
