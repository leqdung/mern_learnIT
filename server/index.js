require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const { configDotenv } = require('dotenv')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
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
    )
    console.log('Mongoodb connected')
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}

connectDB()
const app = express()
//để đọc bất cứ dữ liệu req gửi lên
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/post', postRouter)

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server start on PORT: ${PORT}`)
})
