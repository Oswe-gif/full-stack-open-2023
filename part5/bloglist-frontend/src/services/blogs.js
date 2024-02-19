import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null //private variable

const setToken = newToken => {
  token = `Bearer ${newToken}`
}
const getAll = async() => {
  /*const request = axios.get(baseUrl)
  return request.then(response => response.data)*/
  const response = await axios.get(baseUrl)
  return response.data
}
const createBlog = async(newObject)=>{
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl,newObject,config)
  return response.data
}

export default { createBlog, getAll, setToken }