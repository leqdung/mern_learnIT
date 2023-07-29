const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const verifyToken = require('../middleware/auth')

/**
 * @router @get post
 * @desc get post
 * @access Private
 *
 */
router.get(
  '/',
  verifyToken /**dung bac bao ve de kiem tra truoc khi login, khi kiem tra dung xong bac bao ve moi goi next */,
  async (req, res) => {
    try {
      const posts = await Post.find({ user: req.userId }).populate('user', [
        'username',
      ]) /**populate hiện ra các trường, chi lay trường nào mà  muốn (username)*/
      res.json({ success: true, posts })
    } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, message: 'Interal server error' })
    }
  }
)
/**
 * @router post
 * @desc
 * @access
 *
 * login and authorization
 */
router.post(
  '/',
  verifyToken /**dung bac bảo vệ để kiểm tra  truoc khi login, khi kiem tra dung xong bac bao ve moi goi next */,
  async (req, res) => {
    const { title, description, url, status } = req.body
    console.log(req.body)
    //simple valid
    if (!title)
      return res
        .status(400)
        .json({ success: false, message: 'Title is require' })
    //đã có data
    try {
      let updatedPost = {
        /**dùng let để có thể thay đổi */ title,
        description: description || ' ',
        url: (url.startsWith('https://') ? url : `https://${url}`) || ' ',
        status: status || 'TO LEARN',
      }
      const postUpdateCondition = {
        _id: req.params.id,
        user: req.userId,
      } /**điều kiện là id của post, và userId phải đúng */
      updatedPost = await Post.findOneAndUpdate(
        postUpdateCondition /**điều kiện */,
        updatedPost /**lấy dữ liệu này để update */,
        {
          new: true,
        } /**Sau khi update xong sẽ return về post mới /ngược lại return post cũ */
      )
      /**Kiểm tra nếu không có post đấy hoặc không có người user không đúng */
      if (!updatedPost)
        return res.status(401).json({
          success: false,
          message: 'Post not found or user not authorized',
        })
      res.json(
        /**update thanh cong */
        status(200).json({
          success: true,
          message: 'Excellent process',
          post: updatedPost,
        })
      )
    } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, message: 'Interal server error' })
    }
  }
)
/**
 * @router @PUT api/post
 * @desc Update post
 * @access Private
 */

router.put('/:id', verifyToken, async (req, res) => {
  //Móc dữ liệu
  const { title, description, url, status } = req.body
  console.log(req.body)
  //simple valid
  if (!title)
    return res.status(400).json({ success: false, message: 'Title is require' })
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
})
module.exports = router
