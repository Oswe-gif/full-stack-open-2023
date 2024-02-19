const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs=await Blog.find({}).populate('user', {blogs:0});
    response.json(blogs);
  })
  
blogsRouter.post('/', async(request, response) => {
    const likes = request.body.likes ? request.body.likes:0

    const user = request.user
    if(!user){
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    //const blog = new Blog({...request.body, user._id,likes})
    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      user: user._id,
      url: request.body.url,
      likes: likes
    })
    //const blog = new Blog(request.body)
    const savedBlog = await blog.save()
    request.user.blogs = request.user.blogs.concat(savedBlog._id)
    await request.user.save()

    response.status(201).json(savedBlog);
  })

blogsRouter.delete('/:id', async(request, response)=>{

  const user = request.user
  if(!user){
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  //console.log(user.blogs.toString(), ' ',request.params.id, 'so:', user.blogs.toString().includes(request.params.id))
  if(user.blogs.toString().includes(request.params.id)){
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  }
  response.status(401).json({error: 'you do not have permissions'})
})

blogsRouter.put('/:id', async(request, response)=>{
  body= request.body;
  const user = request.user
  if(!user){
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const blog = {
    title: body.title,
    author: user.username,
    url: body.url,
    likes: body.likes
  }
  if(user.blogs.toString().includes(request.params.id)){
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    return response.json(updatedBlog);
  }
  response.status(401).json({error: 'you do not have permissions'})

})

module.exports = blogsRouter