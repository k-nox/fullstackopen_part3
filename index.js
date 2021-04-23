const e = require('express');
const { response } = require('express');
const express = require('express');
const app = express();

app.use(express.json());

const persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '123-456-7890',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '987-654-3210',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '456-123-7890',
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '123-789-4560'
  }
]

// GET request for all persons
app.get('/api/persons', (req, res) => {
  res.json(persons);
})

// GET request for /info route
app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people.</p> <p>${new Date()}</p>`);
})

// GET request for single person
app.get('/api/persons/:id', (req, res) => {
  const id = +req.params.id;
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person);
  } else {
    res.status(404).send('Person does not exist');
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})