require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const Person = require('./models/person')

morgan.token('object', function stringify (request) {
  return JSON.stringify(request.body)
})

app.use(cors())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object')) //
app.use(express.json())


const errorHandler = (error, request, response, next) => {
  // console.log(error.name)
  console.log('efeni  ')
  // console.log('qnifiqiiiq2i')

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  console.log(body.name, body.number)
  const newPerson = {
    name: body.name,
    number: body.number
  }

  console.log(newPerson)
  Person.findByIdAndUpdate(request.params.id, newPerson, {new: true})
    .then(person => response.json(person))
    // .catch(error => next(error))
})

app.get('/info', (request, response) => {
    console.log(persons.length)
    // console.log(typeof(persons.map(person => person.id)))
    const date = new Date()
    Person.find({}).then(found => {
      const info = `<p>Phonebook has info for ${found.length} people</p>` +  
            `<p>${date.toString()}</p>`

      response.send(info)
    })
    
  })

app.delete('/api/persons/:id', (request, response) => {
  console.log("reached")
  persons = persons.filter(person => person.id !== Number(request.params.id))
  console.log(persons)
  response.status(204).end()
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  const person = new Person({
    name: body.name,
    number: body.number
  })
  console.log(person)
  if (!person.name) {
    response.status(400)
    response.json({"error": "name not provided"})
  }
  else if (!person.number) {
    response.status(400)
    response.json({"error": "number not provided"})
  }
  else {
    // persons = persons.concat(person)
    person.save().then(savedPerson => response.json(savedPerson))
  }
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})