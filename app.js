const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const app = express();
const port = process.env.PORT || 8080;
const example1 = require('./js/example1.js')
const example2 = require('./js/example2.js')

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) { 
  res.status(200).sendFile('./html/index.html', { root: __dirname })
});

app.get('/example1', function (req, res) { 
  res.status(200).sendFile('./html/example1.html', { root: __dirname })
});

app.get('/example2', function (req, res) { 
  res.status(200).sendFile('./html/example2.html', { root: __dirname })
});

app.get('/example3', function (req, res) { 
  res.status(200).sendFile('./html/example3.html', { root: __dirname })
});

app.get('/example1Template', function (req, res) { 
  res.status(200).sendFile('./html/templates/example1Template.html', { root: __dirname })
});

app.get('/example2Template1', function (req, res) { 
  res.status(200).sendFile('./html/templates/example2Template1.html', { root: __dirname })
});

app.get('/example2Template2', function (req, res) { 
  res.status(200).sendFile('./html/templates/example2Template2.html', { root: __dirname })
});

app.get('/example1/solution', function (req, res) { 
  example1.getRoutes( function(result) {
    console.log(result)
    res.status(200).send(result)
  })
});

app.get('/example2/solution1', function (req, res) { 
  example2.getAllRouteStops( function(routeStopList) {
    example2.getStopRange(routeStopList, function(resultJson) {
      res.status(200).send(resultJson)
    })
  })
});

app.get('/example2/solution2', function (req, res) { 
  example2.getAllRouteStops( function(routeStopList) {
    example2.getIntersectingStops(routeStopList, function(resultJson) {
      res.status(200).send(resultJson)
    })
  })
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});
 
app.listen(port, function () {
  console.log('App started at http://localhost:' + port);
});

