const axios = require('axios')
module.exports = {
  getRoutes: function (callback) {
    return getAllRoutes(callback)
  }
}

// Function for fetching all rail routes from the MBTA API
function getAllRoutes(callback){
  axios.get('https://api-v3.mbta.com/routes?filter[type]=0,1')
  .then((res) => {
   callback(trimData(res.data))
  })
  .catch((error) => {
    console.error(error)
  })
};

// Slim down the response JSON to only contain the fields we need
// to return to the frontend
function trimData(responseJson, callback){
  let routeArray = []
  responseJson.data.forEach(object => {
    routeArray.push({
      "id": object.id,
      "long_name": object.attributes.long_name,
      "destinations": object.attributes.direction_destinations,
      "description": object.attributes.description,
      "color": object.attributes.color
    })
  })
  return routeArray
}