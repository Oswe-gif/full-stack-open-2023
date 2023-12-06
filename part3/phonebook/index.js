const express = require('express');
const app = express();
app.use(express.json())

persons= [
    { 
      name: "Arto Hellas", 
      number: "040-123456",
      id: 1
    },
    { 
      name: "Ada Lovelace", 
      number: "39-44-5323523",
      id: 2
    },
    { 
      name: "Dan Abramov", 
      number: "12-43-234345",
      id: 3
    },
    { 
      name: "Mary Poppendieck", 
      number: "39-23-6423122",
      id: 4
    }]

app.get('/', (request, response) => {
    response.send('<h1>Welcome!</h1>')
})

app.get('/info', (request, response) => {
    const information={
        length: `Phonebook has info for ${persons.length} people`,
        date: new Date()
    }
    response.send(`<p> ${information.length} </p> <p> ${information.date} </p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})


app.post('/api/persons',(request, response)=>{
    const body = request.body;
    if(!body.name){
        return response.status(400).json({ 
            error: `name missing`
        })
    }
    if(!body.number){
        return response.status(400).json({ 
            error: `number missing`
        })
    }

    if(persons.find(person => person.name===body.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person={
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 500)
    }
    persons = persons.concat(person);
    response.json(person);
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})