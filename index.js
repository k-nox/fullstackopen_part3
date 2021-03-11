const express = require('express');
const morgan = require('morgan');

const app = express();

morgan.token('content', (req, res) => JSON.stringify(req.body));

app.use(express.json());
app.use(express.static('build'));

app.use(
  morgan('tiny', {
    skip: (req, res) => req.method === 'POST',
  })
);

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :content', {
    skip: (req, res) => req.method !== 'POST',
  })
);

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

// returns new random ID between 0 and 999999 inclusive
const generateId = () => {
  const id = Math.floor(Math.random() * 1000000);
  if (persons.some((person) => person.id === id)) {
    return generateId();
  }
  return id;
};

const checkForErrorsInPOST = (person) => {
  if (!person.name) {
    return {
      error: 'name must be included',
    };
  }

  if (!person.number) {
    return {
      error: 'number must be included',
    };
  }

  if (persons.some((p) => p.name === person.name)) {
    return {
      error: 'name must be unique',
    };
  }
};

app.post('/api/persons', (request, response) => {
  const body = request.body;

  const error = checkForErrorsInPOST(body);
  if (error) {
    return response.status(400).json(error);
  }

  if (body.name)
    person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    };

  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
