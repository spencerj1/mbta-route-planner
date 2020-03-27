const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const app = express();
const port = process.env.PORT || 8080;
const example1 = require('./example1.js')

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) { 
  res.status(200).sendFile('./index.html', { root: __dirname })
});

app.get('/example1', function (req, res) { 
  res.status(200).sendFile('./example1.html', { root: __dirname })
});

app.get('/example1/solution', function (req, res) { 
  const routes = example1.getRoutes( function(result) {
    console.log(result)
    res.status(200).send(result)
  })
});

app.get('/routeTemplate', function (req, res) { 
  const routes = example1.getRoutes( function(result) {
    console.log(result)
    res.status(200).send(result)
  })
});

app.get('/example2', function (req, res) { 
  res.status(200).sendFile('./example2.html', { root: __dirname })
});

app.get('/example3', function (req, res) { 
  res.status(200).sendFile('./example3.html', { root: __dirname })
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});
 
app.listen(port, function () {
  console.log('App started at http://localhost:' + port);
});

