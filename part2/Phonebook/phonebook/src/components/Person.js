const Person = (props) => {
  const personsToShow = props.filter==='' ? props.persons:props.persons.filter(person =>person.name.includes(props.filter));
    return (
      personsToShow.map(person => <li key={person.id}>{person.name} {person.number}</li>)
    )
  }
  
  export default Person