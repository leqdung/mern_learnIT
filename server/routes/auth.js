const express = require('express')
const router = express.Router()
const User = require('../models/User')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

// router post
router.post('/register', async (req, res) => {
  const { username, password } = req.body
  //simple validation
  if (!username || !password) {
    res
      .status(400)
      .json({ success: false, message: 'Missing username or Password' })

    try {
      //check for exiting user
      const user = await User.findOne({ username })
      if (user) {
        return res
          .status(400)
          .json({ success: false, message: 'Username already taken' })
      }
      // all cool => chuyển user name và password thành mã hash
      const hashedPassword = await argon2.hash(password)
      const newUser = new User({ username, password: hashedPassword })
      await newUser.save() //import new user to db
      // return token
      const accessToken = jwt.sign({ userId: newUser._id })
    } catch (error) {}
  }
})
// desc
// access public
module.exports = router
