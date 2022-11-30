const express = require('express');
const app = express();

// scenario 1
// guess: ?
// real: first, fifth, seventh
// matches first, bc '/', matches fifth bc err param,
// matches seventh bc params, sends and ends

// scenario 2
// guess: third, fourth
// real: first, fifth, sixth, seventh
// matches first because of '/', goes fifth bc err param
// matches sixth bc '/other-resource', no error, matches seventh, ends

// scenario 3
// guess: first, fifth, seventh
// real: first, fifth, seventh
// matches first, bc '/', matches fifth bc err param,
// doesn't match other paths, matches seventh bc params, sends and ends

// First
// matches every request with path '/'
app.use('/', (req, res, next) => {
  console.log('First');
  const error = new Error('First');
  next(error);
});

// Second
app.use((req, res, next) => {
  console.log('Second');
  next();
});

// Third
app.get('/other-resource', (req, res, next) => {
  console.log('Third');
  next();
}, (req, res, next) => {
  res.send('Message');
});

// Fourth
const fourth = (req, res, next) => {
  console.log('Fourth');
  const error = new Error('Fourth');
  throw error;
};

// Fifth
const fifth = (err, req, res, next) => {
  console.log('Fifth');
  next();
};

app.use('/', [fourth, fifth]);

// Sixth
app.get('/other-resource', (req, res, next) => {
  console.log('Sixth');
  next();
});

// Seventh
app.use((req, res, next) => {
  console.log('Seventh');
  res.send('Message');
});

// Eighth
app.use((err, req, res, next) => {
  console.log('Eighth');
  res.send('Message');
});

const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));
