const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();
const Person = require('./models/person')
require('dotenv').config()
app.use(express.json());
app.use(cors());
morgan.token('body', request =>JSON.stringify(request.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'));
app.use(express.static('build'));

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

app.get('/info', (request, response) => {

    Person.find({}).then(persons =>{
        const information={
            length: `Phonebook has info for ${persons.length} people`,
            date: new Date()
        }
        response.send(`<p> ${information.length} </p> <p> ${information.date} </p>`)

    })
    
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons =>{
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next)=>{
    const id = request.params.id;
    Person.findById(id).then(person =>{
        if(person){
            response.json(person);
        }
        else{
            response.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    //persons = persons.filter(person => person.id !== id)
    Person.deleteOne({_id: id}).then(response.status(204).end())
    
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
    Person.find({name: body.name}).then(result =>{
        if(JSON.stringify(result) !== JSON.stringify([]))
        {
            console.log('result: ',JSON.stringify(result), ' []: ', JSON.stringify([]), JSON.stringify(result) === JSON.stringify([]))
            response.status(400).json({
                error: 'name must be unique'
            })
        }
        else{
            const person = new Person({...body});
            person.save().then(result =>{
                response.json(result);
            })
        }
    })
    /*if(persons.find(person => person.name===body.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }*/

    /*const person={
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 500)
    }*/
    /*persons = persons.concat(person);*/
    
})

const PORT =process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})