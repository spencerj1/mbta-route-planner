  let template
  let allRouteStops
  let allIntersectingStops
  $.ajax({
    url: '/example3Template',
    cache: true,
    success: function(data) {
        const source = data
        template = Handlebars.compile(source) //Using Handlebars as the templating engine
    }               
  })

  // Fetch the entire stoplist from the API to populate form fields
  $.ajax({
    url: '/example2/getAllStops',
    cache: true,
    success: function(stopList) {
        console.log(stopList)
        allRouteStops = stopList
        $.each(stopList, function (index, value) {
        	$(`<option>${index}</option>`).appendTo('#startLineSelector')
        	$(`<option>${index}</option>`).appendTo('#destinationLineSelector')
        })
        populateSelector($('#startLineSelector option:selected').text(), '#startStationSelector')
        populateSelector($('#destinationLineSelector option:selected').text(), '#destinationStationSelector')
    }               
  })

  function populateSelector(line, selector) {
  	$(selector).empty()
  	$.each(allRouteStops[line], function (index, value) {
  		$(`<option>${value.attributes.name}</option>`).appendTo(selector)
  	})
  }

  $('#startLineSelector').on('change', function() {
  	populateSelector(this.value, '#startStationSelector')
  });

  $('#destinationLineSelector').on('change', function() {
  	populateSelector(this.value, '#destinationStationSelector')
  });

  function calculateRoute(callback) {
  	const startLine = $('#startLineSelector option:selected').text()
    const endLine = $('#destinationLineSelector option:selected').text()
    const startStation = $('#startStationSelector option:selected').text()
    const endStation = $('#destinationStationSelector option:selected').text()
    let route = []
    // Fetch the list of intersecting stops from API
    $.ajax({
      url: '/example2/getIntersectingStops',
      cache: true,
      success: function(intersectingStops) {
      	route.push({[startLine]: startStation})
        if(startLine != endLine){
        	for (const station in intersectingStops){
        		let lines = intersectingStops[station].lines
        		if(lines.includes(startLine) && lines.includes(endLine)){
        			route.push({[endLine]: station})
        			route.push({[endLine]: endStation})
        			callback(route)
        			return
        		}
        	}
        	if(route.length == 1){
        		for (const station in intersectingStops){
        			let lines = intersectingStops[station].lines
        			if(lines.includes(startLine)){
        				for(const line in lines){
        					let connectingLine = lines[line]
        					if(connectingLine != startLine){
        					for(const station2 in intersectingStops){
        						if (intersectingStops[station2].lines.includes(connectingLine)
        					 	&& intersectingStops[station2].lines.includes(endLine)){
        							route.push({[connectingLine]: station})
        							if(station2 != endStation){
        								route.push({[endLine]: station2})
        							}
        							route.push({[endLine]: endStation})
        							callback(route)
        							return
        						}
        					}
        				}
        			}
        		}
        	}
            }
        }
        route.push({[endLine]: endStation})
        callback(route)
        return
      }               
    })
   }

   function displayRoute() {
   	 $('#routeList').empty()
   	 const route = calculateRoute(function(route){
   	 	$.each(route, function(index, value) {
   	 		let routeJson = {}
   	 		if (index == 0){
   	 			routeJson["instruction"] = "Get on"
   	 		}else if(index == route.length - 1) {
   	 			routeJson["instruction"] = "Get off"
   	 		}else{
   	 			routeJson["instruction"] = "Transfer to"
   	 		}
   	 		routeJson["line"] = Object.keys(value)
   	 		routeJson["stop"] = Object.values(value)
   	 		let html = template(routeJson) 
          	$('#routeList').append(html)
   	 	})
   	 })
   }