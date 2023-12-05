import axios from "axios";

const getByName=name=>{
    return axios.get(`https://restcountries.com/v3.1/name/${name}`).then(response => response.data).catch(error => console.log(error))
}
const getLatLonCityByName=(cityName, limit,WEATHER_API_KEY)=>{
    return axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${WEATHER_API_KEY}`).then(response =>response.data).catch(error => console.log(error))
}
const getWeatherByName=(lat, lon,WEATHER_API_KEY)=>{
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`).then(response => response.data).catch(error => console.log(error));
}
export default {getByName, getLatLonCityByName,getWeatherByName}