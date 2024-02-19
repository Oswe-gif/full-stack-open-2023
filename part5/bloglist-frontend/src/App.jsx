import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Form from './components/Form'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] =useState('')
  const [password, setPassword] =useState('')
  const [title, setTitle] =useState('')
  const [author, setAuthor] =useState('')
  const [url, setUrl] =useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage]=useState([null, null])

  useEffect(() => {
    /*blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )*/ 
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if(loggedUserJSON){
      setUser(loggedUserJSON)
    }
    async function fetchData() {
      try{
        const blogs=await blogService.getAll()
        setBlogs(blogs)
      }
      catch(exception){
        console.log(exception)
      }

    }
    fetchData()

  }, [])

  const handleLogin = async(event)=>{
    event.preventDefault()
    try{
      const user = await loginService.login({username, password})
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
    }
    catch(exception){
      setMessage([`Wrong user or password`, 'error'])
      console.log(exception)
    }
    setTimeout(()=>setMessage([null, null]),5000)

  }
  const handleCreateBlog=async(event)=>{
    event.preventDefault()
    try{
      const newBlog={
        "title":title,
        "author":author,
        "url":url
      }
      blogService.setToken(JSON.parse(user).token)
      const response=await blogService.createBlog(newBlog)
      setBlogs(blogs.concat(response))
      console.log(response)
      setMessage([`A new blog: ${response.title} by ${author}`, 'notificacion'])

      setTitle('')
      setAuthor('')
      setUrl('')
      
    }
    catch(exception){
      console.log(exception)
    }

    setTimeout(()=>setMessage([null, null]),5000)
  }

  const handleUsernameChange = (event)=>{
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event)=>{
    setPassword(event.target.value)
  }
  const logout =()=>{
    setUser(null)
    setTitle('')
    setAuthor('')
    setUrl('')
    window.localStorage.removeItem('loggedNoteappUser')
  }
  const handleTitleChange=(event)=>{
    setTitle(event.target.value)
  }
  const handleAuthorChange=(event)=>{
    setAuthor(event.target.value)
  }
  const handleUrlChange=(event)=>{
    setUrl(event.target.value)
  }
  const loginForm=[
    {
      id:1,
      type: "text",
      value: username,
      name: "username",
      onChange: handleUsernameChange
    },
    {
      id:2,
      type: "password",
      value: password,
      name: "password",
      onChange: handlePasswordChange
    }
  ]
  const newBlogForm=[{
    id:1,
    type: "text",
    value: title,
    name: "title",
    onChange: handleTitleChange
  },
  {
    id:2,
    type: "text",
    value: author,
    name: "author",
    onChange: handleAuthorChange
  },
  {
    id:3,
    type: "text",
    value: url,
    name: "url",
    onChange: handleUrlChange
  }]

  return (
    <div>
      {!user && <div>
      <Notification message={message[0]} className={message[1]}/>
      <Form title={'Log in to application'} fields={loginForm} buttonName={"login"} onSubmitFunction={handleLogin}/>
      </div>}

      {user && <div>
        <h2>blogs</h2>
        <Notification message={message[0]} className={message[1]}/>
        <p>{user.name} logged in <button onClick={logout}>Logout</button></p>
        <Form title={'create new'} fields={newBlogForm} buttonName={"create"} onSubmitFunction={handleCreateBlog}/>
        {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
        </div>
      }

    </div>
  )
}

export default App