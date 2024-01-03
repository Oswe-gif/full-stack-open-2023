const blogsRouter = require('express').Router()
const { request } = require('../app');
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs=await Blog.find({});
    response.json(blogs);
  })
  
blogsRouter.post('/', async(request, response) => {
    const likes = request.body.likes ? request.body.likes:0
    const blog = new Blog({...request.body, likes})
    //const blog = new Blog(request.body)
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog);
  })

blogsRouter.delete('/:id', async(request, response)=>{
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async(request, response)=>{
  body= request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog);
})

module.exports = blogsRouter