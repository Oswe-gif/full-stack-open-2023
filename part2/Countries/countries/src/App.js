import { useState } from 'react';
import countriesService from './services/countriesService';

function App() {
  const [countries, setContries]=useState([]);
  const [filter, setFilter]=useState('');

  const handleFilter =(event)=>{
    setFilter(event.target.value)
    countriesService.getByName(event.target.value).then(countriesFilter => {
        setContries(countriesFilter===undefined ? []:countriesFilter.map(a =>a.name.common))  
    });

  }
  return (
    <div>
      <div>find countries <input value={filter} onChange={handleFilter}/></div>
      {countries.length >=10 ? 'To many matches, specify another filter': <ul>{countries.map(names => <li key={names}>{names}</li>)}</ul>}
      
    </div>
  );
}

export default App;
