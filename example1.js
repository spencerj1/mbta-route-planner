const axios = require('axios')
module.exports = {
  getRoutes: function (callback) {
    return get_routes(callback)
  }
}

function get_routes(callback){
  axios.get('https://api-v3.mbta.com/routes?filter[type]=0,1')
  .then((res) => {
    
   callback(res.data)
  })
  .catch((error) => {
    console.error(error)
  })
};