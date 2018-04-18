const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
var cors = require('cors')

const port = 80 || process.env.PORT

const messages = [
  {
    text: "Welcome at the performance login.",
    code: "blue"
  },
  {
    text: "Please login with username an password.",
    code: "blue"
  },
  {
    text: "Sorry, an error occurred.",
    code: "blue"
  },
  {
    text: "Our data center is on fire hold on.",
    code: "blue"
  }
]

const app = express();

app.use(cors())

app.use(compression())

app.use("/", express.static('public', { maxage: '2h' }))
app.use("/", express.static('node_modules', { maxage: '2h' }))

app.use("/api", bodyParser.json())
app.use("/api", bodyParser.urlencoded())

app.get('/api/status', (req, res) => {
  const messageNumber = Math.floor((Math.random() * 4));
  return setTimeout(() => res.send(messages[messageNumber]), 2000);
});

app.post('/api/login', (req, res) => {
  if (req.body.username.toUpperCase() === 'HELLO' && req.body.password.toUpperCase() === 'WORLD') {
    return res.send({
      text: "Successful login.",
      code: "green"
    })
  }
  return res.send({
    text: "Error login please try again",
    code: "red"
  });
});

app.get('/boomerang', (req, res) => {
  console.log(123, req.query)
  return res.send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})