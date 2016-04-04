

/**

 * agent.js

 * 

 * @file Object intended to act on environment made be environment.js

 *

 * @author Miguel Vazquez

 * @version 3

 */





/* agent.js

 * 

 * Description:  Object intended to act on environment made be environment.js

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

 * @constructor Agent

 * @param {graph} graphData This is the graph that will be acted on

 * @param {number} agentNumber Index number of the agent

 * @param {number} currentLocation Value of the vertex the agent is currently located on

 * @param {miniGraph} miniMap This is the master mini-map that all of the agents update

 * @property {number} agentIndex Index number of the agent

 * @property {Sensors} sensors Sensor belonging to this agent

 * @property {Vertex} currentNode Vertex the agent is located on

 * @property {number} tiles_scanned Number of tiles this particular agent has scanned

 * @property {number} timesActed Number of times the agent has acted on the environment

 * @property {Graph} searchSpace The graph that will be acted on

 * @property {Effectors} effectors The effectors controlled by the agent

 * @property {number} area Calculated area of the environment

 * @property {boolean} stillRunning States whether the agent is still running or not

 * @property {number} leftOverValue Values that are left trapped under agent when it is done running

 * @property {MiniGraph} masterMiniMap MiniGraph that is shared by all agents

 * @property {MiniGraph} graph MiniGraph that belongs to this agent

 */



var Agent = function (graphData , agentNumber , rootNode, miniMap) {

	this.agentIndex = agentNumber;

	this.sensors;

	this.currentNode = graphData.vertices[rootNode];

	this.tiles_scanned = 0;

	this.timesActed = 0;

	this.searchSpace = graphData;

	this.effectors = new Effectors();

	this.area = graphData.length * graphData.width;

	this.stillRunning = true;

	this.leftOverValue = 0;

	this.masterMiniMap = miniMap;

	this.graph = new MiniGraph(graphData, agentNumber);

	this.graph.solutionPath = "";

};



/**

 * Agent type that will move for limited amount of time

 * @method Agent.simpleAgent

 * @param {graph} graphData This is the graph that will be acted on

 */

Agent.prototype.simpleAgent = function (graphData) {

    var locationChange,

		nodeValue,

		newLocation,

		searchSpace = graphData.vertices,

		rootNodeIndex = this.currentNode.index,

		tiles_scanned = this.tiles_scanned,

		sensors = this.sensors,

		area = this.area,

		effectors = this.effectors;

		stack = new Array();

		

	if(tiles_scanned < area){

		stack.push(searchSpace[rootNodeIndex]);

		currentNode = stack.pop();

		currentNode = childInterference(graphData, currentNode);



		if(sensors.doesTileHaveValue(currentNode)){

			timesToChangeValue = sensors.hyperAction();

			

			for(var i = 0 ; i < timesToChangeValue ; i++){

				graphData.valueTiles += effectors.decreaseValue(currentNode);

			}

			

			this.timesActed += 1;

			

		}

		

		nodeValue = currentNode.index; 

		this.sensors.checkSurroundings(currentNode);

		locationChange = direction(sensors,graphData);

		

		for (i = 0; i < currentNode.neighbors.length; i += 1) {

			var indexToAdd = currentNode.neighbors[i];

			

			if (nodeValue + locationChange == indexToAdd) {

				stack.push(searchSpace[indexToAdd]);

			}

		}

		

		if(stack.length == 0){

			stack.push(currentNode);

		}

		

		this.currentNode = stack[stack.length - 1];

		this.sensors = sensors;

		this.tiles_scanned += 1;

	

	}

	

	else{

		

		this.stillRunning = false;

		this.leftOverValue = this.currentNode.valueLevel;

		

	}

};



/**

 * Agent type that will move until there is no value remaining on the graph. Will move towards most

 * valuable direction

 * @method Agent.valueSensingAgent

 * @param {graph} graphData This is the graph that will be acted on

 */

Agent.prototype.valueSensingAgent = function (graphData) {

    var locationChange,

		nodeValue,

		newLocation,

		searchSpace = graphData.vertices,

		rootNodeIndex = this.currentNode.index,

		sensors = this.sensors,

		effectors = this.effectors;

		stack = new Array();



	if(graphData.valueTiles !== 0){

		stack.push(searchSpace[rootNodeIndex]);

		currentNode = stack.pop();

		curretnNode = childInterference(graphData, currentNode);

		

		if(sensors.doesTileHaveValue(currentNode)){

			timesToChangeValue = sensors.hyperAction();

			

			for(var i = 0 ; i < timesToChangeValue ; i++){

				graphData.valueTiles += effectors.decreaseValue(currentNode);

			}

			

			this.timesActed += 1;

		}

		

		nodeValue = currentNode.index;

		this.sensors.checkSurroundings(currentNode);

		locationChange = lookAheadDirection(currentNode,sensors,graphData);

		

		for (i = 0; i < currentNode.neighbors.length; i += 1) {

			var indexToAdd = currentNode.neighbors[i];

			

			if (nodeValue + locationChange == indexToAdd) {

				stack.push(searchSpace[indexToAdd]);

			}

			

		}

		

		if(stack.length == 0){

			stack.push(currentNode);

		}

		

		this.currentNode = stack[stack.length - 1];

		this.sensors = sensors;

		this.tiles_scanned += 1;

		}

	

	else{

		this.stillRunning = false;

	}

	

};



/**

 * Agent type that will move until there is no value remaining on the graph. Will move

 * towards most valuable neighbor

 * @method Agent.valueChasingAgent

 * @param {graph} graphData This is the graph that will be acted on

 */

Agent.prototype.valueChasingAgent = function (graphData) {

    var locationChange,

		nodeValue,

		newLocation,

		searchSpace = graphData.vertices,

		rootNodeIndex = this.currentNode.index,

		sensors = this.sensors,

		effectors = this.effectors;

    	stack = new Array();

    	

    if(graphData.valueTiles !== 0){	

    	stack.push(searchSpace[rootNodeIndex]);

    	currentNode = stack.pop();

    	currentNode = childInterference(graphData, currentNode);

    	

    	

    	if(sensors.doesTileHaveValue(currentNode)){

    		timesToChangeValue = sensors.hyperAction();

    		

    		for(var i = 0 ; i < timesToChangeValue ; i++){

    			graphData.valueTiles += effectors.decreaseValue(currentNode);

    		}

    		

    		this.timesActed += 1;

    	}

    	valueInformation = sensors.valueOfNeighbors(currentNode);

    	

    	nodeValue = currentNode.index;

    	this.sensors.checkSurroundings(currentNode);

    	locationChange = lookAheadDirection(currentNode,sensors,graphData);

    	

    	if(valueInformation[0]){

    		stack.push(valueInformation[1]);

    	}

    	

    	else{

    		

    		for (i = 0; i < currentNode.neighbors.length; i += 1) {

    			var indexToAdd = currentNode.neighbors[i];

    			if (nodeValue + locationChange == indexToAdd) {

    				stack.push(searchSpace[indexToAdd]);

    			}

    		}

    		

    	}

    	

    	if(stack.length == 0){

    		stack.push(currentNode);

    	}

    	

    	this.currentNode = stack[stack.length - 1];

    	this.sensors = sensors;

    	this.tiles_scanned += 1;

    	

    }

    

    else{

		this.stillRunning = false;

	}

    

};



/**

 * Agent type that will move until there is no value remaining on the graph. Will move towards most

 * valuable direction and update a mini-map that it has

 * @method Agent.miniMappingAgent

 * @param {graph} graphData This is the graph that will be acted on

 */

Agent.prototype.miniMappingAgent = function (graphData) {

    var locationChange,

		nodeValue,

		newLocation,

		searchSpace = graphData.vertices,

		rootNodeIndex = this.currentNode.index,

		sensors = this.sensors,

		miniMap = this.graph,

		valueInfo = [],

		shouldLookAtMap = false,

		masterMiniMap = this.masterMiniMap;

		effectors = this.effectors;

    	stack = new Array();

    		

    if(graphData.valueTiles !== 0){	

    	stack.push(searchSpace[rootNodeIndex]);

    	currentNode = stack.pop();

    	currentNode = childInterference(graphData, currentNode);



    	

    	nodeValue = currentNode.index;



    	if(sensors.doesTileHaveValue(currentNode)){

    		timesToChangeValue = sensors.hyperAction();

    		for(var i = 0 ; i < timesToChangeValue ; i++){

    			graphData.valueTiles += effectors.decreaseValue(currentNode);

    		}

    		this.timesActed += 1;

    	}

    	

    	valueInfo = sensors.neighboringValueInformation(currentNode);

    	miniMap.updateMiniMap(currentNode, valueInfo);

    	masterMiniMap.updateMiniMap(currentNode, valueInfo);

    	

    	if(!miniMap.graph.pathExists || miniMap.graph.valueTiles == 0){

    		this.sensors.checkSurroundings(currentNode);

    		locationChange = lookAheadDirection(currentNode,sensors,graphData);

    		valueInformation = sensors.valueOfNeighbors(currentNode);

    		if(valueInformation[0]){

    			stack.push(valueInformation[1]);

    		}

    		else{

    			

    			for (i = 0; i < currentNode.neighbors.length; i += 1) {

    				var indexToAdd = currentNode.neighbors[i];

    				if (nodeValue + locationChange == indexToAdd) {

    					stack.push(searchSpace[indexToAdd]);

    				}

    			}

    			

    		}

    		if(stack.length == 0){

        		stack.push(currentNode);

        	}

    		if(stack[stack.length - 1].valueLevel == 0){

    			shouldLookAtMap = true;

    		}

    	}

    	if((miniMap.graph.pathExists || shouldLookAtMap) && miniMap.graph.valueTiles > 0){

    		var indexToAdd;

    		indexToAdd = lookAtMap(currentNode,miniMap);

    		if(sensors.checkPath(indexToAdd)){

    			stack.push(currentNode);

    		}

    		else{

    			stack.push(searchSpace[indexToAdd]);

    		}

    		shouldLookAtMap = false;

    	}

    	this.currentNode = stack[stack.length - 1];

    	this.sensors = sensors;

    	this.tiles_scanned += 1;

    	if(stack.length == 0){

    		stack.push(currentNode);

    	}

    }

    else{

		this.stillRunning = false;

	}

    

};



/**

 * Function that will cause the agent to be moved to a different vertex

 * @method Agent#childInterference

 * @param {graph} graphData This is the graph that will be acted on

 * @param {vertex} currentLocation Vertex the agent is currently located on

 * @returns {vertex} This will be either be a new randomly chosen vertex or the vertex the agent is already located on

 */		

childInterference = function(graphData, currentNode){

	var luck = Math.random() * 100,

		newLocation = Math.floor(Math.random() * graphData.vertices.length),

		childInterferencePercent = document.getElementById("childInterferenceValue").value,

		vertices = graphData.vertices,

		verticesNumber = vertices.length;

	

	if(luck <= childInterferencePercent & document.getElementById("childInterfere").checked){

		while(graphData.vertices[newLocation].valueLevel == -1){

			newLocation = Math.floor(Math.random()*(verticesNumber))

		}

		return vertices[newLocation];

	}

	

	return currentNode;

}



/**

 * Function meant to create sensors and create a connection between the agents so they know of one anothers location

 * @method Agent.partnerConnection

 * @param {Agent[]} agents array containing all of the other agents acting on the environment

 */

 Agent.prototype.partnerConnection = function(agents){

   	var numberOfAgents = agents.length,

   		roombaNumber = this.agentIndex,

   		agentSet = [];

   	

   	for(var i = 0 ; i < numberOfAgents-1 ; i++){

   		agentSet[i] = agents[(roombaNumber+i+1) % numberOfAgents];

   	}

   	

   	this.sensors = new Sensors(this.searchSpace,agentSet);

   	

}

 

 /**

  * Function that uses sensory data to decide which direction to use. Simple movement decision

  * @method Agent#direction

  * @param {sensor} sensor This is the sensor with the bumper data to be used in order to decide on a direction

  * @param {graph} graphData This is the graph that will be acted on

  * @returns {number} shift This value is how much the currentLocations value needs to be incremented/decremented to give you the value of the neighbor in the desired direction

  */  

direction = function(sensor,graphData){

		var shift = 0,

			neighborExistence = sensor.neighborExistence,

			directionalData = sensor.directionalData,

			randomFactor = Math.random()*100,

			width = graphData.width;

			directionalData[1] = false;

			

		if(randomFactor < 20){

			directionalData[1] = true;

			directionalData[2] = true;

		}	

		

		if(neighborExistence[2] && !neighborExistence[1]){	

			directionalData[0] = true;

			

	    	if((neighborExistence[0] || neighborExistence[3]) && !directionalData[2]){

	    		directionalData[1] = true;

	     	}

	    	

	     }

		

	     else if (!neighborExistence[2] && neighborExistence[1]){

	     	directionalData[0] = false;

	     	

	     	if((neighborExistence[0] || neighborExistence[3]) && !directionalData[2]){

	     		directionalData[1] = true;

	     	}

	     	

	     }

		

	     if  (neighborExistence[2] && directionalData[0] && !directionalData[1]){

	     	shift += 1;

	     	directionalData[2] = false;

	     }

	     

	     else if (neighborExistence[1] && !directionalData[0] && !directionalData[1]){

	     	shift -= 1;

	     	directionalData[2] = false;

	     }

	     

	     else if (neighborExistence[0] && (directionalData[3] || !neighborExistence[3])){

	     	shift -= (width);

	     	directionalData[2] = true;

	     	directionalData[3] = true;

	     }

			

	     else if (neighborExistence[3] && (!directionalData[3] || !neighborExistence[0])){ 

	     	shift -= (-width);

	     	directionalData[2] = true;

	     	directionalData[3] = false;

	     }

	     

	     sensor.preferredDirection = -1;

	     return shift;

	}



/**

 * Function that uses sensory data to decide which direction to use. Informed decision

 * @method Agent#lookAheadDirection

 * @param {sensor} sensor This is the sensor with the directionValueCounter data to be used in order to decide on a direction

 * @param {graph} graphData This is the graph that will be acted on

 * @returns {number} shift This value is how much the currentLocations value needs to be incremented/decremented to give you the value of the neighbor in the desired direction

 */ 

lookAheadDirection = function(currentNode,sensor,graphData){

	var dataPack = [],

		neighborExistence = sensor.neighborExistence,

		directionalValueCounter = sensor.directionalValueCounter,

		width = graphData.width,

		preferredDirection = sensor.preferredDirection;

		shift = 0;

		

	dataPack[0] = [];

	dataPack[1] = [];

	dataPack[2] = [];

	dataPack[3] = [];

	

	var	length = dataPack.length,

		displacementData = [];

	displacementData[0] = -(width);

	displacementData[1] = -1;

	displacementData[2] = 1;

	displacementData[3] = width;

	

	

	if(preferredDirection !== -1 && directionalValueCounter[preferredDirection] !== 0){

		return -(-displacementData[preferredDirection]);

	}

	

	for(var i = 0 ; i < length ; i++){

		dataPack[i][0] = neighborExistence[i];

		dataPack[i][1] = directionalValueCounter[i];

		dataPack[i][2] = displacementData[i];

	}

	

	dataPack.sort(function(a,b){

		return a[0] - b[0];

	});

	

	dataPack.sort(function(a,b){

		return a[1] - b[1];

	});

	

	if(dataPack[length - 1][0]){

		shift -= -(dataPack[length - 1][2]);

		

		if(shift == -width){

			sensor.preferredDirection = 0;

		}

		

		else if(shift == -1){

			sensor.preferredDirection = 1;

		}

		

		else if(shift == 1){

			sensor.preferredDirection = 2;

		}

		

		else if(shift == width){

			sensor.preferredDirection = 3;

		}

		

	}

	

	

	if(dataPack[length - 1][1] == 0){

		shift = direction(sensor,graphData)

	}

	

	

	return shift;

	

}



/**

 * Function that uses sensory data to decide which direction to use. Informed movement decision

 * @method Agent#lookAtMap

 * @param {vertex} currentLocation This is the vertex the agent is currently located on

 * @param {minigraph} miniGraph This is the minigraph that will provide the information of the environment the agent knows of

 * @returns {vertex} nodeIndex This is the number of the vertex the agent should head towards next

 */ 

lookAtMap = function(currentNode, miniGraph){

	var search = new Search,

		bestValueLevel = 3,

		graph = miniGraph.graph,

		searchSpace = graph.vertices,

		counter = 0,

		numberOfVertices = searchSpace.length,

		rootIndex = 0,

		stringIndex,

		solution = graph.solutionPath,

		index = currentNode.index,

		nodeIndex = currentNode.index;

	

	rootIndex = currentNode.index;

	if(!graph.pathExists){

		while(searchSpace[index].valueLevel !== bestValueLevel && bestValueLevel !== 0){

			counter++;

			index = (index + 1) % numberOfVertices;

			if(counter == numberOfVertices){

				counter = 0;

				bestValueLevel -= 1;

			}

		}

		graph.goal = index;

	}

	if(solution === ""){

		graph.pathExists = false;

	}

	if(!graph.pathExists){

		Search.beam(graph, rootIndex);

		solution = graph.solutionPath;

	}

	else{

		stringIndex = solution.indexOf("-");

		if(stringIndex == -1){

			nodeIndex = solution;

			graph.solutionPath = "";

			graph.pathExists = false;

		}

		else{

			nodeIndex = solution.substring(0,stringIndex);

			graph.solutionPath = solution.slice(stringIndex + 1);

		}

	}

	return nodeIndex;

	

}