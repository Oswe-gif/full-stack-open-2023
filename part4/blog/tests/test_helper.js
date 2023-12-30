const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'My first dog :)',
        author: 'Jhoan Ome',
        url: 'wwww.dog.com',
        likes: 5

    },
    {
        title: 'My last dog :)',
        author: 'Celeste',
        url: 'wwww.dog.com',
        likes: 1
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => {
      return blog.toJSON()
    })
}

const findABlogInDb = async (title) =>{
    const blog = await Blog.find({title: title});
    return blog[0].toJSON()
}

module.exports = {
    initialBlogs, blogsInDb, findABlogInDb
  }