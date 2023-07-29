const express = require('express');
const router = express.Router();
const User = require('../models/User');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

// router post
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  //simple validation
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: 'Missing username or Password' });

  try {
    //check for exiting user
    const user = await User.findOne({ username });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: 'Username already taken' });

    // all cool => chuyển user name và password thành mã hash
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save(); //import new user to db

    // return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN
    );
    res.json({
      success: true,
      message: 'User created successful',
      accessToken,
    });
  } catch (error) {}
  console.log(error);
  res.status(500).json({ success: false, message: 'Internal verver error' });
});
// desc
// access public

/**
 * login user
 * public
 *
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  //simple validation
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: 'Missing username and/or Password' });

  try {
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .send({ success: false, message: 'Incorect username and/or password' });
    //username found
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res
        .status(400)
        .send({ success: false, message: 'Incorect username and/or password' });

    //all good
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN
    );
    res.json({
      success: true,
      message: 'User login successful',
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
module.exports = router;
