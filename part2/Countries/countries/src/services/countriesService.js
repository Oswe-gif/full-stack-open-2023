import axios from "axios";

const baseURL ='https://restcountries.com/v3.1/name';

const getByName=name=>{
    return axios.get(`${baseURL}/${name}`).then(response => response.data).catch(error => console.log(error))
}
export default {getByName}