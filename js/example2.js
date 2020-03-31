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

function getRouteStops(routeId, callback){
  axios.get(`https://api-v3.mbta.com/stops?filter[route]=${routeId}`)
    .then((res) => {
      callback(res)
    })
    .catch((error) => {
    console.error(error)
  })
}

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

function getStopRange(routeStopList, callback){
  let resultJson
  let counter = 0
  Object.keys(routeStopList).forEach(key => {
    totalStops = routeStopList[key].length
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
      resultJson.mostStops.line = key
      resultJson.mostStops.totalStops = totalStops
    }else if(totalStops <= resultJson.leastStops.totalStops){
      resultJson.leastStops.line = key
      resultJson.leastStops.totalStops = totalStops
    }
    counter++
    if(counter == Object.keys(routeStopList).length){
      callback(resultJson)
    }
  })
}

function getIntersectingStops(routeStopList, callback){
  let resultJson = {}
  Object.keys(routeStopList).forEach(key => {
    routeStopList[key].forEach(stop => {
      Object.keys(routeStopList).forEach(searchKey => {
        routeStopList[searchKey].forEach(searchStop => {
          if(stop.attributes.address == searchStop.attributes.address && (key != searchKey)){
            if(resultJson[stop.attributes.name] == null){
              resultJson[stop.attributes.name] = {
                "lines": [key, searchKey]
              }
            }else if (!resultJson[stop.attributes.name].lines.includes(searchKey)){
              resultJson[stop.attributes.name].lines.push(searchKey)
            }
          }
        })
      })
    })
  })
  callback(resultJson)
}