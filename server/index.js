require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const { configDotenv } = require('dotenv');

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.veajk3q.mongodb.net/?retryWrites=true&w=majority`,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );
    console.log('Mongoodb connected');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB();
const app = express();

app.use(express.json()); //để đọc bất cứ dữ liệu req gửi lên
app.use('/api/auth', authRouter);
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server start on PORT: ${PORT}`);
});
