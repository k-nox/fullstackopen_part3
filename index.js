const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.static('build'));
app.use(cors());

morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
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
];

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
  const person = persons.find(p => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).send('Person does not exist');
  }
})

// DELETE a single entry
app.delete('/api/persons/:id', (req, res) => {
  const id = +req.params.id;
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
})

// generate random ID for new entries between 0 and 999999
const generateId = () => {
  const id = Math.floor(Math.random() * (1000000));

  if (persons.some(person => person.id === id)) {
    return generateId();
  } else {
    return id;
  }
}

// POST request to create a new entry
app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name and number must both be included'
    });
  };

  if (persons.some(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    });
  };

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
})



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})