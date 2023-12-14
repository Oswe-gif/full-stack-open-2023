import axios from "axios";
const baseURL='/api/persons';
//URLs
const getAll=()=>{
    return axios.get(baseURL).then(response => response.data);
}
const create = newObject =>{
    return axios.post(baseURL,newObject).then(response=>response.data);
}
const update = updatedObject =>{
    console.log('new user', updatedObject);
    return axios.put(`${baseURL}`,updatedObject).then(response=>response.data);
}
const deleteUser = id =>{
    return axios.delete(`${baseURL}/${id}`);
}
export default {getAll, create,update, deleteUser}