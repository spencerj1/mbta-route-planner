  let template
  let allRouteStops
  let allIntersectingStops
  // Fetch the Handlebars template to be used
  $.ajax({
    url: '/example3Template',
    cache: true,
    success: function(data) {
        const source = data
        template = Handlebars.compile(source)
    }               
  })

  // Fetch the entire stoplist from the API to populate form fields
  $.ajax({
    url: '/example2/getAllStops',
    cache: true,
    success: function(stopList) {
        console.log(stopList)
        allRouteStops = stopList
        // Add each of the Line options to the line selectors
        $.each(stopList, function (index, value) {
        	$(`<option>${index}</option>`).appendTo('#startLineSelector')
        	$(`<option>${index}</option>`).appendTo('#destinationLineSelector')
        })
        // Add each of the Station options to the station selectors
        populateSelector($('#startLineSelector option:selected').text(), '#startStationSelector')
        populateSelector($('#destinationLineSelector option:selected').text(), '#destinationStationSelector')
    }               
  })

  // Function for populating the station selectors when given line is changed
  function populateSelector(line, selector) {
  	$(selector).empty()
  	$.each(allRouteStops[line], function (index, value) {
  		$(`<option>${value.attributes.name}</option>`).appendTo(selector)
  	})
  }

  // Attach change listener to line selectors
  $('#startLineSelector').on('change', function() {
  	populateSelector(this.value, '#startStationSelector')
  });

  $('#destinationLineSelector').on('change', function() {
  	populateSelector(this.value, '#destinationStationSelector')
  });

  // The function for calculating the Route given starting and ending stations
  function calculateRoute(callback) {
  	// Collect values from the form fields
  	const startLine = $('#startLineSelector option:selected').text()
    const endLine = $('#destinationLineSelector option:selected').text()
    const startStation = $('#startStationSelector option:selected').text()
    const endStation = $('#destinationStationSelector option:selected').text()

    // Push each calculated station into this array - function will eventually return this as the solution
    let route = []

    /* Fetch the list of intersecting stops from API
    	returns intersectingStops JSON - here's and example of the data model:
    		{
    			"Station": {
    				"lines": ['Line Name', 'Line Name', 'Line Name'],
    			},
    			"Station": {
    				"lines": ['Line Name', 'Line Name'],
    			}
    		}
    */
    $.ajax({
      url: '/example2/getIntersectingStops',
      cache: true,
      success: function(intersectingStops) {
      	// Once the API has returned list of intersectingStops, run our algorithm
      	// Always push the initial start point to the solution route array
      	route.push({[startLine]: startStation})

      	// Check to see if stations are on the same line
        if(startLine != endLine){
        	// Loop through intersectingStops list to find the first stop which intersects the End Line
        	for (const station in intersectingStops){
        		let lines = intersectingStops[station].lines
        		// If the stop includes both the Start Line and End Line, push both into the route array and return
        		if(lines.includes(startLine) && lines.includes(endLine)){
        			route.push({[endLine]: station})
        			route.push({[endLine]: endStation})
        			callback(route)
        			return
        		}
        	}
        	// If the previous loop did not return, than the route requires more than one Line transfer
        	// Loop through the intersectingStops list again to find stops with a common Line
        	if(route.length == 1){
        		for (const station in intersectingStops){
        			let lines = intersectingStops[station].lines
        			// If we find an intersectingStation that includes our start Line, loop through the other
        			// 'connector' lines in the Station.lines array
        			if(lines.includes(startLine)){
        				for(const line in lines){
        				// For each line (minus the start line) in station.lines array, loop back
        				// through intersectingStops list to find another station containing the 'connector' line we are searching for
        					let connectingLine = lines[line]
        					if(connectingLine != startLine){
        					for(const station2 in intersectingStops){
        						if (intersectingStops[station2].lines.includes(connectingLine)
        					 	&& intersectingStops[station2].lines.includes(endLine)){
        					 		// If we find a intersectingStop that includes our 'connector' line, as well as our end Line,
        					 		// push the connecting stations/lines, then the end station/ end Line, into the route array and return
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
        // If stations are on the same line, just push the Line and End Station into 
        // the route array and return
        route.push({[endLine]: endStation})
        callback(route)
        return
      }               
    })
   }

   function displayRoute() {
   	 $('#routeList').empty()
   	 const route = calculateRoute(function(route){
   	 	// For each element in the solution route array, compile a handlebars template
   	 	// and inject into the #routeList container
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