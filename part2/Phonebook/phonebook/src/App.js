import { useState, useEffect } from 'react';
import Person from './components/Person';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import axios from 'axios';

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ filter, setFilter ] = useState('');

  useEffect(()=>{
    axios.get('http://localhost:3001/persons').then(response=>{
      setPersons(response.data);
    })
  }, [])


  const addPerson = (event) => {

    event.preventDefault()
    if(persons.filter(person => person.name === newName).length === 0){
      const dataPerson = {
        id: persons.length +1,
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(dataPerson));
      setNewName('');
      setNewNumber('');
    }
    else{
      alert(`${newName} is already added to phonebook`)
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }


  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filter} handleFilterChange={handleFilterChange}/>

      <h2>Add a new </h2>
      <PersonForm person={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>

      <h2>Numbers</h2>
      <ul>
        {
          <Person filter={filter} persons={persons}/>
        }
      </ul>
    </div>
  )
}

export default App