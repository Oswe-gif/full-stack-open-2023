const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
  
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
})

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
        author: 'Francis',
        url: 'wwww.bird.com',
        likes: 10
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const title = blogsAtEnd.map(n => n.title)

    expect(title).toContain('Last one :)')

})

test('likes property is missing from the request, it will default to the value 0', async()=>{
    const newBlog = {
        title: 'Zero likes :(',
        author: 'Somebody',
        url: 'wwww.bugs.com',
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blog = await helper.findABlogInDb(newBlog.title);

    expect(blog.likes).toEqual(0);

},10000)

describe('bad request: properties are missing', () => {
    test('the title is missing from the request data, the backend responds to the request with the status code 400 Bad Request', async()=>{
        const newBlog = {
            author: 'Somebody',
            url: 'wwww.bugs.com',
            likes: 4
        }
        const response = await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(response.body.error).toBeDefined()
        expect(response.body.error).toEqual("Blog validation failed: title: Path `title` is required.")
    
    })
    
    test('the author is missing from the request data, the backend responds to the request with the status code 400 Bad Request', async()=>{
        const newBlog = {
            title: 'without author',
            url: 'wwww.bugs.com',
            likes: 4
        }
        const response = await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(response.body.error).toBeDefined()
        expect(response.body.error).toEqual("Blog validation failed: author: Path `author` is required.")
    
    })
    
    test('the url is missing from the request data, the backend responds to the request with the status code 400 Bad Request', async()=>{
        const newBlog = {
            title: 'without URL',
            author: 'me',
            likes: 4
        }
        const response = await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(response.body.error).toBeDefined()
        expect(response.body.error).toEqual("Blog validation failed: url: Path `url` is required.")
    
    })
    
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const title = blogsAtEnd.map(r => r.title)

    expect(title).not.toContain(blogToDelete.title)
  })
})

describe('update a blog',()=>{
  test('succeeds and returns a json of the updated blog', async()=>{
    const blogwithNewData = {
      title: 'Updated',
      author: 'Updated',
      likes: -1
  }
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogwithNewData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const newUpdatedBlog = await helper.findABlogInDb('Updated')
    expect(newUpdatedBlog.title).toEqual(blogwithNewData.title)
  })
})
afterAll(() => {
    mongoose.connection.close()
})