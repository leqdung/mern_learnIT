/**
 * Nhiem vu nhu bac bao ve dung chan o giua xem co dung access token hay khong
 * Kiem tra accesstoken co 100% hang that hay khong
 * Neu dung accesstoken thi duoc truy cap vao ben trong nguoi dung
 * Authoration = Bearer <accesstoken> => lay duoc accesstoken o day va kiem tra
 */
const jwt = require('jsonwebtoken')
const verifyToken = (req, res, next) => {
  // lay accestoken o trong header
  const authHeader = req.header('Authorization')
  //neu accestoken  = accestoken hoac accesstoken sau khi cat bo ' ' thi lay phan tu thu 2 trong mang moi
  const token = authHeader && authHeader.split(' ')[1]
  // neu token khong ton tai thi
  if (!token)
    return res
      .status(401)
      .json({ success: 'false', message: 'Access token not found' })
  // neu token ton tai thi can phai kiem tra try catch
  try {
    //tra ve doi tuong decoder co chua userId roi sau do se kiem tra userId nay bang cach gan no cho userId cua req
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)
    //gan nguoc userId tu doi tuong tra ve => gan vao userId cua req
    req.userId = decoded.userId
    //sau khi gan xong roi thi cho qua
    next()
  } catch (error) {
    console.log(error)
    //may co accesstoken nhung do la hang lom
    return res
      .status(403)
      .json({ success: false, message: 'Ivalid access token' })
  }
}
//cho bac bao ve vao cong ty
module.exports = verifyToken
