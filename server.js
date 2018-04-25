const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
var cors = require('cors');

const port = process.env.PORT || 5000;

const messages = [
  {
    text: 'Welcome at the performance login.',
    code: 'blue'
  },
  {
    text: 'Please login with username an password.',
    code: 'blue'
  },
  {
    text: 'Sorry, an error occurred.',
    code: 'blue'
  },
  {
    text: 'Our data center is on fire hold on.',
    code: 'blue'
  }
];

const app = express();

app.use(cors());

app.use(compression());

app.use('/jQuery', express.static('jQuery'));
app.use('/polymer-paper-ie', express.static('polymer-paper/build/es5-bundled'));
app.use('/polymer-paper-modern', express.static('polymer-paper/build/es6-bundled'));
app.use('/polymer-ie', express.static('polymer/build/es5-bundled'));
app.use('/polymer-modern', express.static('polymer/build/es6-bundled'));
app.use('/webcomponents', express.static('webcomponents'));
app.use('/node_modules', express.static('node_modules'));

app.use('/api', bodyParser.json());
app.use('/api', bodyParser.urlencoded({ extended: true }));

app.get('/api/status', (req, res) => {
  const messageNumber = Math.floor(Math.random() * 4);
  return setTimeout(() => res.send(messages[messageNumber]), 2000);
});

app.post('/api/login', (req, res) => {
  if (req.body.username.toUpperCase() === 'HELLO' && req.body.password.toUpperCase() === 'WORLD') {
    return res.send({
      text: 'Successful login.',
      code: 'green'
    });
  }
  return res.send({
    text: 'Error login please try again',
    code: 'red'
  });
});

app.listen(port, () => {
  console.log(`Benchmark apps listening
  http://localhost:${port}/jQuery
  http://localhost:${port}/webcomponents
  http://localhost:${port}/polymer-ie
  http://localhost:${port}/polymer-modern
  http://localhost:${port}/polymer-paper-ie
  http://localhost:${port}/polymer-paper-modern
`);
});
