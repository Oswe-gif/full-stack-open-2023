const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'My first dog :)',
        url: 'wwww.dog.com',
        likes: 5

    },
    {
        title: 'My last dog :)',
        url: 'wwww.dog.com',
        likes: 1
    }
]
const getLoggedUser=()=>{
    const username = process.env.USERNAMELOGIN
    const password = process.env.PASSWORD
    return {
            username: username,
            name: "Jhoan",
            password: password
        }
}


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
    initialBlogs, getLoggedUser,blogsInDb, findABlogInDb
  }