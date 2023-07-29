const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const verifyToken = require('../middleware/auth')
// @router post
//@desc
// @access
router.post(
  '/',
  verifyToken /**dung bac bao ve de kiem tra truoc khi login, khi kiem tra dung xong bac bao ve moi goi next */,
  async (req, res) => {
    const { title, description, url, status } = req.body
    console.log(req.body)
    //simple valid
    if (!title)
      return res
        .status(400)
        .json({ success: false, message: 'Title is require' })
    //have data
    try {
      const newPost = new Post({
        title,
        description,
        url: url.startsWith('https://') ? url : `https://${url}`,
        status: status || 'TO LEARN',
        user: req.userId,
      })
      await newPost.save()
      res.json({ success: true, message: 'Happy leaning', post: newPost })
    } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, message: 'Interal server error' })
    }
  }
)
module.exports = router
