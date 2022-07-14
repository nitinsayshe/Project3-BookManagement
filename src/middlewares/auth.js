const jwt = require('jsonwebtoken')
const bookModel = require('../models/bookModel')
const ObjectId = require('mongoose').Types.ObjectId;

const checkAuth = function (req, res, next) {
  try {
    let token = req.headers["X-Api-Key"]
    if (!token) token = req.headers["x-api-key"]
    if (!token) return res.status(404).send({ status: false, message: "token must be present" })

    try {
      decodedToken = jwt.verify(token, 'project-bookManagement');
     
    } catch (error) {
      return res.status(401).send({ status: false, message: error.message })
    }
    req.decodedToken = decodedToken.userId
   // console.log(req.decodedToken)
    next()
  } catch (err) {
    return res.status(500).send({ status: false, Error: err.message })
  }
}

const Authorization = async function (req, res, next) {
  try {

    bookId = req.params.bookId
    if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Book Id is invalid in url!!!!" })
    let user = await bookModel.findById(bookId)
    if (!user) return res.status(400).send({ status: false, message: "book id is invalid in url!!!" })
    let userId = user.userId


    if (userId != req.decodedToken) {
      return res.status(403).send({ status: false, message: "You are not authorized to Do this Task ..." })
    }

    next()
  } catch (err) {
    return res.status(500).send({ status: false, Error: err.message })
  }
}




module.exports.checkAuth = checkAuth;
module.exports.Authorization = Authorization;