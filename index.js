const { request, response } = require('express');
const express = require('express');
const app = express();

let persons = [
  {
    id: 1,
    name: 'Knox Berry',
    number: '123-456-7890',
  },
  {
    id: 2,
    name: 'John Smith',
    number: '789-456-1230',
  },
  {
    id: 3,
    name: 'Harry Jones',
    number: '456-789-1230',
  },
  {
    id: 4,
    name: 'Janet Baker',
    number: '123-789-4560',
  },
];

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
});

app.get('/api/persons/:id', (request, response) => {
  const id = +request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = +request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
