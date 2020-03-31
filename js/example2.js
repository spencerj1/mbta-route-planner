const axios = require('axios')
const example1 = require('./example1.js')
module.exports = {
  getAllRouteStops: function (callback) {
    return getAllRouteStops(callback)
  },
  getStopRange: function (list, callback) {
    return getStopRange(list, callback)
  },
  getIntersectingStops: function (list, callback) {
    return getIntersectingStops(list, callback)
  }
}

// Function for fetching list of stops on a single, given route
function getRouteStops(routeId, callback){
  axios.get(`https://api-v3.mbta.com/stops?filter[route]=${routeId}`)
    .then((res) => {
      callback(res)
    })
    .catch((error) => {
    console.error(error)
  })
}

// Function for compiling a list of every stop on every route
function getAllRouteStops(callback){
  let routeStopList = {}
  const routes = example1.getRoutes( function(result) {
    let counter = 0
    result.forEach(object => {
      getRouteStops(object.id, function(response){
        routeStopList[object.long_name] = response.data.data
        counter++
        if(counter == result.length){
          callback(routeStopList)
        }
      })
    })
  })
};

// Function for calculating the routes with most/least stops - returns JSON
function getStopRange(routeStopList, callback){
  let resultJson
  let counter = 0
  // routeStoplist = List of all routes and subsequent stops
  Object.keys(routeStopList).forEach(key => {
    // Loop through routeStopList, finding the length of the stops array
    totalStops = routeStopList[key].length
    // Initialize JSON object with first values from the routeStopList
    if(resultJson == null){
      resultJson = {
        "mostStops": {
          "title": "Most Stops",
          "line": key,
          "totalStops": totalStops
        },
        "leastStops": {
          "title": "Least Stops",
          "line": key,
          "totalStops": totalStops
        },
      }
    }else if(totalStops >= resultJson.mostStops.totalStops){
      // If totalStops greater than current value in resultJSON, replace it
      resultJson.mostStops.line = key
      resultJson.mostStops.totalStops = totalStops
    }else if(totalStops <= resultJson.leastStops.totalStops){
      // If totalStops less than current value in resultJSON, replace it
      resultJson.leastStops.line = key
      resultJson.leastStops.totalStops = totalStops
    }
    // .forEach runs async, need to keep a counter to know when to hit the callback function
    counter++
    if(counter == Object.keys(routeStopList).length){
      callback(resultJson)
    }
  })
}

// Function for finding stops with intersecting lines - returns JSON
function getIntersectingStops(routeStopList, callback){
  let resultJson = {}
  // Loop through the list of all routes and subsequent stops
  Object.keys(routeStopList).forEach(key => {
    // Loop through each stop on the current route
    routeStopList[key].forEach(stop => {
      Object.keys(routeStopList).forEach(searchKey => {
        // Loop through the list of routes again to find a common stop
        routeStopList[searchKey].forEach(searchStop => {
          if(stop.attributes.address == searchStop.attributes.address && (key != searchKey)){
            // If the resultJson does not already contain the stop, intitialize the key and push
            // both the original route and the route searched
            if(resultJson[stop.attributes.name] == null){
              resultJson[stop.attributes.name] = {
                "lines": [key, searchKey]
              }
            }else if (!resultJson[stop.attributes.name].lines.includes(searchKey)){
              // If resultJson already contains the stop, only push the route searched
              resultJson[stop.attributes.name].lines.push(searchKey)
            }
          }
        })
      })
    })
  })
  callback(resultJson)
}