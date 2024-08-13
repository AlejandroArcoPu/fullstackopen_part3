const express = require('express')
const morgan = require('morgan')

const app = express()

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

app.use(express.json())

// morgan configuration 3.7-3.8
morgan.token('body', function (request, response) { return JSON.stringify(request.body) })

app.use(morgan('tiny', {
  skip: function (req, res) { return req.method === 'POST' }
}))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  skip: function (req, res) { 
    return req.method !== 'POST' 
  }
}))

// exercise 3.1
app.get('/api/persons',(request,response) => {
    response.json(persons)
})

// exercise 3.2
app.get('/info', (request,response) => {
  const date = new Date();  
  let options = {  
    weekday: "long", year: "numeric", month: "short",  
    day: "numeric", hour: "2-digit", minute: "2-digit"  
  };  
  date.toLocaleTimeString("es-ES", options)

  response.send(`<p>PhoneBook has info for ${persons.length} people</p>
    <p>${date}</p>`)
})

// exercise 3.3
app.get('/api/persons/:id',(request,response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => 
    person.id === id)
  if(!person){
    return response.status(404).end()
  }
  response.json(person)
})

// exercise 3.4
app.delete('/api/persons/:id',(request,response) => {
  
  const id = Number(request.params.id)
  //Check first that the person exists
  const person = persons.find(person => 
    person.id === id)
  
  if(!person){
    return response.status(404).end()
  }

  //Then if exists we filter
  persons = persons.filter(person => 
    person.id !== id)

  response.status(204).end()

})

const generateRandomId = () => {
  return Math.floor(Math.random() * 1000)
}

// exercise 3.5-3.6
app.post('/api/persons', (request,response) => {
  if(!request.body.name || !request.body.number){
    return response.status(400).json({
      error: 'missing name or number'
    })
  }

  if(persons.some(person => person.name === request.body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const newPerson = {
    id: generateRandomId(),
    name: request.body.name,
    number: request.body.number
  }

  persons = persons.concat(newPerson)

  response.status(201).json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})