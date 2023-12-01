import axios from "axios";
const baseURL='http://localhost:3001/persons';

const getAll=()=>{
    return axios.get(baseURL).then(response => response.data);
}
const create = newObject =>{
    return axios.post(baseURL,newObject).then(response=>response.data);
}
const update = updatedObject =>{
    console.log('new user', updatedObject);
    return axios.put(`${baseURL}/${updatedObject.id}`,updatedObject).then(response=>response.data);
}
const deleteUser = id =>{
    return axios.delete(`${baseURL}/${id}`).catch(error =>{alert(`The user with id ${id} does not exist`)});
}
export default {getAll, create,update, deleteUser}