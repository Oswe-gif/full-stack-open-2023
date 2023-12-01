import { useState, useEffect } from 'react';
import Person from './components/Person';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import personService from './services/personService';

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ filter, setFilter ] = useState('');

  useEffect(()=>{
    personService.getAll().then(dataObject => setPersons(persons.concat(dataObject)));
  }, [])


  const submitPerson = (event) => {

    event.preventDefault()
    let dataPerson = {
      //id: persons.length +1,
      name: newName,
      number: newNumber
    }

    const user = persons.find(person => person.name === newName);
    if(user !== undefined){
      const textWindow = `${dataPerson.name} is already added to phonebook, replace the old number with new one?`;
      if (window.confirm(textWindow)){
        const changedUser = { ...user, name:dataPerson.name, number: dataPerson.number  }
        personService.update(changedUser).then(updatedObject => setPersons(persons.map(person => person.id === updatedObject.id ? updatedObject : person)));
        setNewName('');
        setNewNumber('');
      }

    }
    else{
      //alert(`${newName} is already added to phonebook`)
      personService.create(dataPerson).then(dataObject => setPersons(persons.concat(dataObject)));
      setNewName('');
      setNewNumber('');
    }
  }
  const deleteUser=(event)=>{
    const id=event.target.value;
    if (window.confirm(`Do you really want to delete ${persons.find(person => person.id==id).name}?`)) {
      personService.deleteUser(id).then(() => {
        personService.getAll().then(dataObject => setPersons(dataObject.filter(person => person.id !==id)))
      });
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
      <PersonForm person={submitPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>

      <h2>Numbers</h2>
      <ul>
        {
          <Person filter={filter} persons={persons} delete={deleteUser}/>
        }
      </ul>
    </div>
  )
}

export default App