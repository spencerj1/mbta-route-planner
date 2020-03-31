# mbta-route-planner
> Small NodeJS web application for retreiving data from the MBTA V3 API

This app is currently hosted at: https://mbta-route-planner.herokuapp.com/

## Setup
1. Install NodeJS - download can be found here: https://nodejs.org/en/download/
2. Clone the repository.
3. In CLI, cd to the repo directory and run `npm install`.
4. Run `node app` to start the application.
5. Navigate to `http://localhost:8080` to access the UI

## Overview
The javascript used to provide a solution for each example can be found in the `/js` folder,
seperated by file. Examples 1 and 2 are server-side JS modules, which provide a JSON solution to the
frontend via the `/solution` endpoints specified in app.js. Example 3 is JS executed in the browser, and leverages
the `/solution` endpoints from examples 1 and 2.

## Things I should definitely do different/Possible future updates
1. Make Example 3 server-side code, create POST endpoint that returns the solution as a JSON
2. Update the algorithm in Example 3 to possibly use a tree data-structure + breadth-first search.
3. Account for the Mattapan Trolley in algorithm for Example 3. Blue Line -> Mattapan requires 4 line transfers
   and the algorithm currently does not calculate that. Moving to a tree structure could fix this.
4. Cache the data retreived from the MBTA endpoints server-side to avoid the pitfalls of MBTA rate limits.
5. Create simple automated test framework for the app
