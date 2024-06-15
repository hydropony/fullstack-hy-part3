const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('object', function stringify (request) {
  return JSON.stringify(request.body)
})

app.use(cors())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object')) //
app.use(express.json())

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }

// app.use(unknownEndpoint)

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
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    // console.log("reached")
    const id = Number(request.params.id)
    const foundperson = persons.find(person => person.id === id)
    if (foundperson) {
        response.json(foundperson)
    }
    else {
        response.status(404).end()
    }
})


app.get('/info', (request, response) => {
    console.log(persons.length)
    // console.log(typeof(persons.map(person => person.id)))
    const date = new Date()
    const info = `<p>Phonebook has info for ${persons.length} people</p>` +  
            `<p>${date.toString()}</p>`

    response.send(info)
  })

app.delete('/api/persons/:id', (request, response) => {
  console.log("reached")
  persons = persons.filter(person => person.id !== Number(request.params.id))
  console.log(persons)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  let person = request.body
  person = {...person, id: Math.round(Math.random() * 1000)}
  console.log(person)
  if (!person.name) {
    response.status(400)
    response.json({"error": "name not provided"})
  }
  else if (!person.number) {
    response.status(400)
    response.json({"error": "number not provided"})
  }
  else if (persons.find(fperson => fperson.name === person.name)) {
    response.status(400)
    response.json({"error": "name is not unique"})
  }
  else {
    persons = persons.concat(person)
    response.json(person)
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})