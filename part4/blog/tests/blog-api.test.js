const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    /*for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }*/

},10000)

test('blog are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
})

test('the unique identifier property of the blog posts is named id', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    blogs.body.forEach(blog => expect(blog.id).toBeDefined());
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'Last one :)',
        url: 'wwww.bird.com',
        likes: 10
    }
    //console.log({username:process.env.USERNAMELOGIN, password:process.env.PASSWORD})
    const user = await api
    .post('/api/users')
    .send(helper.getLoggedUser())

    const response=await api
    .post('/api/login')
    .send(helper.getLoggedUser())
    console.log(response.body)
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${response.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(1)
    const title = blogsAtEnd.map(n => n.title)

    expect(title).toContain('Last one :)')
    expect(user.body.username).toContain(blogsAtEnd[0].author)

}, 30000)

test('likes property is missing from the request, it will default to the value 0', async()=>{
    const newBlog = {
        title: 'Zero likes :(',
        url: 'wwww.bugs.com',
    }
    await api
    .post('/api/users')
    .send(helper.getLoggedUser())

    const response=await api
    .post('/api/login')
    .send(helper.getLoggedUser())

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${response.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blog = await helper.findABlogInDb(newBlog.title);

    expect(blog.likes).toEqual(0);

},10000)

describe('bad request: properties are missing', () => {

    test('the title is missing from the request data, the backend responds to the request with the status code 400 Bad Request', async()=>{
        const newBlog = {
            url: 'wwww.bugs.com',
            likes: 4
        }
        await api
        .post('/api/users')
        .send(helper.getLoggedUser())
    
        const responseUser=await api
        .post('/api/login')
        .send(helper.getLoggedUser())

        const response = await api
          .post('/api/blogs')
          .set('Authorization', `bearer ${responseUser.body.token}`)
          .send(newBlog)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(response.body.error).toBeDefined()
        expect(response.body.error).toEqual("Blog validation failed: title: Path `title` is required.")
    
    })
    
    /*test('the author is missing from the request data, the backend responds to the request with the status code 400 Bad Request', async()=>{
        const newBlog = {
            title: 'without author',
            url: 'wwww.bugs.com',
            likes: 4
        }
        const response = await api
          .post('/api/blogs')
          .set('Authorization', `bearer ${responseUser.body.token}`)
          .send(newBlog)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(response.body.error).toBeDefined()
        expect(response.body.error).toEqual("Blog validation failed: author: Path `author` is required.")
    
    })*/
    
    test('the url is missing from the request data, the backend responds to the request with the status code 400 Bad Request', async()=>{
        const newBlog = {
            title: 'without URL',
            author: 'me',
            likes: 4
        }
        await api
        .post('/api/users')
        .send(helper.getLoggedUser())
    
        const responseUser=await api
        .post('/api/login')
        .send(helper.getLoggedUser())

        const response = await api
          .post('/api/blogs')
          .set('Authorization', `bearer ${responseUser.body.token}`)
          .send(newBlog)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(response.body.error).toBeDefined()
        expect(response.body.error).toEqual("Blog validation failed: url: Path `url` is required.")
    
    })
    
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    //const blogsAtStart = await helper.blogsInDb()
    //const blogToDelete = blogsAtStart[0]
    const newBlog = {
      title: 'to delete',
      url: 'www.blog.com',
      likes: 4
    }

    await api
    .post('/api/users')
    .send(helper.getLoggedUser())

    const responseUser=await api
    .post('/api/login')
    .send(helper.getLoggedUser())

    const responseBlog = await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${responseUser.body.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    await api
      .delete(`/api/blogs/${responseBlog.body.id}`)
      .set('Authorization', `bearer ${responseUser.body.token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      0
    )

    //const title = blogsAtEnd.map(r => r.title)

    //expect(title).not.toContain(blogToDelete.title)
  })
})

describe('update a blog',()=>{
  test('succeeds and returns a json of the updated blog', async()=>{
    const newBlog = {
      title: 'to update',
      url: 'www.blog.com',
      likes: 4
    }

    await api
    .post('/api/users')
    .send(helper.getLoggedUser())

    const responseUser=await api
    .post('/api/login')
    .send(helper.getLoggedUser())

    const responseBlog = await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${responseUser.body.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogwithNewData = {
      title: 'Updated',
      likes: -1
  }
    //const blogsAtStart = await helper.blogsInDb()
    //const blogToUpdate = blogsAtStart[0]
    await api
    .put(`/api/blogs/${responseBlog.body.id}`)
    .send(blogwithNewData)
    .set('Authorization', `bearer ${responseUser.body.token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const newUpdatedBlog = await helper.findABlogInDb('Updated')
    expect(newUpdatedBlog.title).toEqual(blogwithNewData.title)
  })
})

describe('bad request: TOKEN is missing', () =>{
  
  test('try to add a blog with no token', async () => {
    const newBlog = {
        title: 'Last one :)',
        url: 'wwww.bird.com',
        likes: 10
    }

    const response=await api
    .post('/api/login')
    .send(helper.getLoggedUser())
    console.log(response.body)
    const responseBlog=await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(0)
    expect('token missing or invalid').toEqual(responseBlog.body.error)

})
  test('try to delete a blog with no token', async () => {
    const newBlog = {
      title: 'to delete',
      url: 'www.blog.com',
      likes: 4
    }

    await api
    .post('/api/users')
    .send(helper.getLoggedUser())

    const responseUser=await api
    .post('/api/login')
    .send(helper.getLoggedUser())

    const responseBlog = await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${responseUser.body.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    responseToDelete =await api
      .delete(`/api/blogs/${responseBlog.body.id}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      1)
    expect('token missing or invalid').toEqual(responseToDelete.body.error)

  })

  test('try to update a blog with no token', async()=>{
    const newBlog = {
      title: 'to update',
      url: 'www.blog.com',
      likes: 4
    }

    await api
    .post('/api/users')
    .send(helper.getLoggedUser())

    const responseUser=await api
    .post('/api/login')
    .send(helper.getLoggedUser())

    const responseBlog = await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${responseUser.body.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogwithNewData = {
      title: 'Updated',
      likes: -1
  }
    responseToUpdate=await api
    .put(`/api/blogs/${responseBlog.body.id}`)
    .send(blogwithNewData)
    .expect(401)
    .expect('Content-Type', /application\/json/)

    const newUpdatedBlog = await helper.findABlogInDb('to update')
    expect(newUpdatedBlog.title).toEqual('to update')
    expect('token missing or invalid').toEqual(responseToUpdate.body.error)
  })
})

describe('bad request: without permissions', () =>{
  test('try to update a blog of another user', async()=>{
    const newBlog = {
      title: 'to update',
      url: 'www.blog.com',
      likes: 4
    }

    await api
    .post('/api/users')
    .send(helper.getLoggedUser())

    const responseUser=await api
    .post('/api/login')
    .send(helper.getLoggedUser())

    const responseBlog = await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${responseUser.body.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogwithNewData = {
      title: 'Updated',
      likes: -1
  }
    const responseToUpdate = await api
    .put(`/api/blogs/${(parseInt(responseBlog.body.id)-1)}`)
    .send(blogwithNewData)
    .set('Authorization', `bearer ${responseUser.body.token}`)
    .expect(401)
    .expect('Content-Type', /application\/json/)

    const newUpdatedBlog = await helper.findABlogInDb('to update')
    expect(newUpdatedBlog.title).toEqual('to update')

    expect('you do not have permissions').toEqual(responseToUpdate.body.error)

  })

  test('try to delete a blog of another user', async () => {
    const newBlog = {
      title: 'to delete',
      url: 'www.blog.com',
      likes: 4
    }

    await api
    .post('/api/users')
    .send(helper.getLoggedUser())

    const responseUser=await api
    .post('/api/login')
    .send(helper.getLoggedUser())

    const responseBlog = await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${responseUser.body.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    responseToDelete =await api
      .delete(`/api/blogs/${(parseInt(responseBlog.body.id)-1)}`)
      .set('Authorization', `bearer ${responseUser.body.token}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      1)
    expect('you do not have permissions').toEqual(responseToDelete.body.error)
  })
})

afterAll(() => {
    mongoose.connection.close()
})