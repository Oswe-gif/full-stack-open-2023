import { useState } from 'react';
import countriesService from './services/countriesService';

function App() {
  const api_key = process.env.REACT_APP_API_KEY;
  const [countries, setContries]=useState([]);
  const [temperature, setTemperature]=useState({temp: '', wind:'',icon:''});
  const [filter, setFilter]=useState('');
  const [pushedButtonToShowInformation, setPushedButtonToShowInformation]=useState(['',false]);

  const handleFilter =(event)=>{
    setFilter(event.target.value)
    setPushedButtonToShowInformation(false);
    getCountryInformation(event.target.value);

  }
  const getCountryInformation=(cityName)=>{
    countriesService.getByName(cityName).then(countriesFilter => {
      setContries(countriesFilter===undefined ? []:countriesFilter)  
  });
  }
  const getWeather=(cityName, limit, WEATHER_API_KEY)=>{
    
    countriesService.getLatLonCityByName(cityName,limit,WEATHER_API_KEY )
    .then(cityInformation =>cityInformation[0])
    .then(city =>countriesService.getWeatherByName(city.lat, city.lon,WEATHER_API_KEY))
    .then(weather => setTemperature({
      temp: weather.main.temp,
      wind: weather.wind.speed,
      icon: weather.weather[0].icon  
    }));
  }


  const CountryInformation=(name)=>{
    const country = countries.find(p => p.name.common === name);
    getWeather(country.capital, 1, api_key)
    return (
      <>
        <h1>{country.name.common}</h1>
        <div>Capital {country.capital}</div>
        <div>Population {country.population}</div>
        <h2>Languages</h2>
        <ul>{Object.values(country.languages).map(languages => <li key={languages}>{languages}</li>)}</ul>
        <img src={country.flags.png} />
        <h2>Weather in {country.capital}</h2>
        <div>Temperature {temperature.temp} Kelvin</div>
        <img src={`https://openweathermap.org/img/wn/${temperature.icon}@2x.png`}/>
        <div>Wind {temperature.wind} m/s</div>

    </>
    )
  }


  const Display =()=>{
    
    if(countries.length >=10){
      return(
        <div>To many matches, specify another filter</div>
      )
    }
    if(countries.length ===1){
      return CountryInformation(countries[0].name.common);
    }
    if(pushedButtonToShowInformation[1]){
      return CountryInformation(pushedButtonToShowInformation[0]);
    }
    else{
      return(
        <ul>{countries.map(conuntries => <li key={conuntries.name.common}>{conuntries.name.common} <button value={conuntries.name.common} onClick={(event)=>setPushedButtonToShowInformation([event.target.value,true])}>Show</button></li>)}</ul>
      )
    }
  }
  return (
    <div>
      <div>find countries <input value={filter} onChange={handleFilter}/></div>
      {Display()}
      
    </div>
  );
}

export default App;
