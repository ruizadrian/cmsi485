

/** sensors.js

 * 

 * @file Object intended to be used by agent to receive information about the environment

 *

 * @author Miguel Vazquez

 *

 * @version 3

*/



/* sensors.js

 * 

 * Description:  Object intended to be used by agent to receive information about the environment

 *

 * Created by:  @author Miguel Vazquez     Date:  7-8-2013

 *

 * Change History:

 * 7-8-2013  Miguel Vazquez  .Initial version.

 * 7-30-2013 Miguel Vazquez  Changed variable names to be more generic so that if scenario 

 * 							 changes same variables can be used

 **********************************************************************

*/



/**

 * @constructor Sensors

 * @param {graph} graphData Graph that the sensor will be gather information on

 * @param {Agent[]} agents Array of agents that are running besides the one that created the Sensors object

 * @property {boolean[]} neighborExistence Array containing boolean values stating whether neighbors exist or not. Array order [Up, Left, Right, Down]

 * @property {boolean[]} directionalData Array containing data related to simple movements. [movingRight, horizontalBumper, movingUp, verticalBumper]

 * @property {number[]} directionalValueCounter Array containing the values of each direction. Array order [Up, Left, Right, Down]

 * @property {Graph} searchSpace Graph that sensor will be gathering data from

 * @property {Agent[]} partners Array holding the agents besides the agent this sensor belongs to

 * @property {number} preferredDirection Used with lookAhead movements. Holds the direction it is causing it to move in currently

 * @property {number[]} neighboringValue Array holding values of the immediate neighbors of the agent this sensor belongs to.

 */

var Sensors = function (graphData,agents) {

	this.neighborExistence = [];

	this.directionalData = [];

	this.directionalData[0] = true;

	this.directionalValueCounter = [];

	this.searchSpace = graphData;

	this.partners = agents;

	this.preferredDirection = -1;

	this.neighboringValue = [];

};



/**

 * Function that will return a 1,2 or 3 depending on a percent chance

 * @method Sensors.hyperAction

 * @returns Value which will be used to indicate the number of times and agent will act on a vertex

 */

Sensors.prototype.hyperAction = function (){

	var luck = Math.random() * 100,

		hyperAction1 = document.getElementById("hyperAction1Value").value,

		hyperAction2 = document.getElementById("hyperAction2Value").value;

	if(document.getElementById("hyperAction").checked){

		if(luck < hyperAction2){

			return 3;

		}

		else if(luck < hyperAction1){

			return 2;

		}

	}

	return 1;

}



/**

 * Function that checks to see which of the neighbors around the current location exist

 * @method Sensors.checkSurroundings

 * @param {vertex} currentLocation vertex the agent is currently located on

 */

Sensors.prototype.checkSurroundings = function(currentNode){

   	var left = -1,

  		right = -1,

   		down = -1,

   		up = -1,

   		lengthOfNeighbors = currentNode.neighbors.length,

   		neighbors = currentNode.neighbors,

   		location = currentNode.index,

   		graph = this.searchSpace,

   		neighborExistence = this.neighborExistence,

   		directionalValueCounter = this.directionalValueCounter

   		partners = this.partners;

   	

   	neighborExistence[0] = false;

   	neighborExistence[1] = false;

   	neighborExistence[2] = false;

   	neighborExistence[3] = false;

   	for(var i = 0 ; i < lengthOfNeighbors ; i++){

   		if(!(graph.vertices[neighbors[i]].isObstacle) && !(otherAgent(neighbors[i],partners))){

   			if( neighbors[i] == location - 1){

   				left = neighbors[i];

   			}

   			if( neighbors[i] == location - graph.width){

   				up = neighbors[i];

   			}

   			

   			if( neighbors[i] == location - (-1)){

   				right = neighbors[i];

   			}

   		

   			if( neighbors[i] == location - (-graph.width)){

   				down = neighbors[i];

   			}

   		}

   	}

    	

    if(up !== -1){

    	neighborExistence[0] = true;

    }

    	

    if(left !== -1){

    	neighborExistence[1] = true;

    }



    if(right !== -1){

    	neighborExistence[2] = true

    }

    	

    if(down !== -1){

    	neighborExistence[3] = true;

    }

    directionalValueCounter = lookAhead(currentNode, graph,neighborExistence, directionalValueCounter);

}



/**

 * Function that checks to see if a location contains another agent

 * @method Sensors#otherAgent

 * @param {number} possibleLocation number of vertex that is being checked

 * @param {Agent[]} partners Array of the other agents

 * @returns {boolean} States whether another agent is on the vertex in question

 */

otherAgent = function(possibleLocation, partners){

   	var numberOfPartners = partners.length;

   	for(var i = 0 ; i < numberOfPartners ; i++){

   		if(possibleLocation == partners[i].currentNode.index){

   			return true;

   		}

   	}

   	return false;

}



/**

 * Function that checks to see if a location contains another agent. Will be used for Search functionality to avoid agents crossing one another

 * @method Sensors.checkPath

 *  @param {number} possibleLocation number of vertex that is being checked

 *  @returns {boolean} States whether another agent is on the vertex in question

 */

Sensors.prototype.checkPath = function(possibleLocation){

	var partners = this.partners,

		numberOfPartners = partners.length;

   	for(var i = 0 ; i < numberOfPartners ; i++){

   		if(possibleLocation == partners[i].currentNode.index){

   			return true;

   		}

   	}

   	return false;

}



/**

 * Function that will "look" in all four directions and sum the value of tiles in each direction. This information is passed to the directionalValueCounter

 * @method Sensors#lookAhead

 * @param {vertex} currentLocation Vertex the agent is currently located on

 * @param {graph} graphData Graph that is being observed

 * @param {boolean[]} neighborExistence Array containing booleans stating whether a neighbor in a direction exists. Order is as follows [up,left,right,down]

 * @returns {number[]} directionalValueCounter Array contains the value of every direction in the following order [up,left,right,down]

 */

lookAhead = function (currentNode, graphData,neighborExistence, directionalValueCounter){

   	var counterUp = 0,

   		counterLeft = 0,

   		counterRight = 0,

   		counterDown = 0,

   		spaces,

   		currentValue = currentNode.index,

   		length = graphData.length,

   		searchSpace = graphData.vertices,

   		width = graphData.width,

   		obstacleFound = false;

   	if(neighborExistence[0]){

   		spaces = Math.floor((currentValue)/width);

   		for(var i = 1 ; i <= spaces; i++){

   			if(searchSpace[currentValue - i * width].valueLevel == -1){

   				obstacleFound = true;

   			}

   			if(!obstacleFound){

   				counterUp += searchSpace[currentValue - i * width].valueLevel;

   			}

   		}

   	}

   	obstacleFound = false;

   	if(neighborExistence[1]){

   		spaces = Math.floor((currentValue)%width);

   		for(var i = 1 ; i <= spaces; i++){

   			if(searchSpace[currentValue - i].valueLevel == -1){

   				obstacleFound = true;

   			}

   			if(!obstacleFound){

   				counterLeft += searchSpace[currentValue - i].valueLevel;

   			}

   		}

   	}

   	obstacleFound = false;

   	if(neighborExistence[2]){

   		spaces = width - Math.floor((currentValue)%width);

   		for(var i = 1 ; i < spaces; i++){

   			if(searchSpace[currentValue + i].valueLevel == -1){

   				obstacleFound = true;

   			}

   			if(!obstacleFound){

   				counterRight += searchSpace[currentValue + i].valueLevel;

   			}

   		}

   	}

   	obstacleFound = false;

   	if(neighborExistence[3]){

   		spaces = length - Math.floor((currentValue)/width);

   		for(var i = 1 ; i < spaces; i++){

   			if(searchSpace[currentValue + i * width].valueLevel == -1){

   				obstacleFound = true;

   			}

   			if(!obstacleFound){

   				counterDown += searchSpace[currentValue + i * width].valueLevel;

   			}

   		}

   	}

   	directionalValueCounter[0] = counterUp;

   	directionalValueCounter[1] = counterLeft;

   	directionalValueCounter[2] = counterRight;

   	directionalValueCounter[3] = counterDown;

   	return directionalValueCounter;

}



/**

 * Function that gathers the values of the neighbors sorts them and returns the neighbor with the highest value

 * @method Sensors.valueOfNeighbors

 * @param {number[]} currentLocation Vertex the agent is currently located on

 * @returns {object[]} resultArray Array contains a boolean followed by a vertex. The boolean states whether there is a neighbor with a value and the vertex is the highest valued vertex

 */

Sensors.prototype.valueOfNeighbors = function(currentNode){

  	var neighborsToSort = [],

   		resultArray = [],

   		searchSpace = this.searchSpace.vertices,

   		neighbors = currentNode.neighbors,

   		partners = this.partners,

   		lengthOfArray = 0;

    resultArray[0] = false;

    resultArray[1] = currentNode;

        

    for (i = 0; i < neighbors.length; i += 1) {

    	var indexToAdd = neighbors[i];

        if ((searchSpace[indexToAdd].valueLevel >= 1) && !(otherAgent(neighbors[i],partners))) {

           	neighborsToSort.push(searchSpace[indexToAdd])

        }

    }

    lengthOfArray = neighborsToSort.length;

    if (lengthOfArray >= 1){

    	neighborsToSort.sort(function (a, b) {

    		return (a.valueLevel) - (b.valueLevel);

	    });

    	resultArray[0] = true;

    	resultArray[1] = neighborsToSort[lengthOfArray-1];

    }

    return resultArray;

}



/**

 * Function that gathers the values of the neighbors located around the current vertex and returns the values in an array

 * @method Sensors.neighboringValueInformation

 * @param {number[]} currentLocation Vertex the agent is currently located on

 * @returns {number[]} Array containing the value of the neighboring vertices. Array is in the following order [up,left,right,down]

 */

Sensors.prototype.neighboringValueInformation = function(currentNode){

	var neighborsValue = [],

		searchSpace = this.searchSpace.vertices,

		neighbors = currentNode.neighbors,

		partners = this.partners;

    

	for (i = 0; i < neighbors.length; i += 1) {

		var indexToAdd = neighbors[i];

			neighborsValue.push(searchSpace[indexToAdd].valueLevel);

	}

	return neighborsValue;

}



/**

 * Function which returns a boolean stating whether the current vertex has a value or not

 * @method Sensors.doesTileHaveValue

 * @param {vertex} currentLocation Vertex the agent is currently located on

 * @returns {boolean} States whether the current location of the agent has a value or not

 */

Sensors.prototype.doesTileHaveValue = function(currentNode){

   	var luck = Math.random()*100,

   		booleanResult = false;

   	

   	if(currentNode.valueLevel > 0){

   		booleanResult = true;

   	}

   	if(luck < document.getElementById("sensorFailValue").value && document.getElementById("sensorSwitch").checked){

   		return !booleanResult;

   	}

   	return booleanResult;

}