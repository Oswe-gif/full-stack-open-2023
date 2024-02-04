const User = require('../models/user')
const jwt = require('jsonwebtoken')

const userExtractor = async(request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token=authorization.substring(7)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      request.user =null
    }
    request.user = await User.findById(decodedToken.id)
  }
  else {
    request.user = null
  }
  next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}


const errorHandler = (error,request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
      } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
      }
}

module.exports = {unknownEndpoint, errorHandler, userExtractor}



