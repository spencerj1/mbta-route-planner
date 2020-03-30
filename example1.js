const axios = require('axios')
module.exports = {
  getRoutes: function (callback) {
    return get_routes(callback)
  }
}

function get_routes(callback){
  axios.get('https://api-v3.mbta.com/routes?filter[type]=0,1')
  .then((res) => {
   callback(trimData(res.data))
  })
  .catch((error) => {
    console.error(error)
  })
};

function trimData(data, callback){
  let routeArray = []
  data.data.forEach(object => {
    routeArray.push({
      "long_name": object.attributes.long_name,
      "destinations": object.attributes.direction_destinations,
      "description": object.attributes.description,
      "color": object.attributes.color
    })
  })
  return routeArray
}