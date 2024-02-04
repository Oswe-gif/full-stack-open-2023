const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/',async(request, response)=>{
    const users=await User.find({}).populate('blogs',{likes:0})
    response.json(users);
})

usersRouter.post('/', async(request, response)=>{
    const userData = request.body
    if(userData.password.length < 3){
        return response.status(400).json({error: 'The password must be at least 3 characters long'})
    }
    const passwordHash = await bcrypt.hash(userData.password, 10)
    const user = new User({...userData, passwordHash})
    const savedUser = await user.save();
    response.status(201).json(savedUser)

})
module.exports = usersRouter