
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
	/*Explanation of variables
	 * locationChange - will contain a value that states the offset in grid location from current node to desired node
	 * nodeValue - grid location of the current node
	 * searchSpace - collection of grids in the environment used for traversal
	 * rootNodeIndex - used to push current node onto stack 
	 * tiles_scanned - a running tally of the number of tiles the agent has gone over
	 * sensors - the sensor object the belongs to the particular agent
	 * area - the width * height of the environment
	 * effectors - effector object that belongs to the particular agent
	 */
    var locationChange,
		nodeValue,
		searchSpace = graphData.vertices,
		rootNodeIndex = this.currentNode.index,
		tiles_scanned = this.tiles_scanned,
		sensors = this.sensors,
		area = this.area,
		effectors = this.effectors;
		stack = new Array();
		
	if(tiles_scanned < area){
		//It might be possible to merge the next two lines
		stack.push(searchSpace[rootNodeIndex]);
		currentNode = stack.pop();
		currentNode = childInterference(graphData, currentNode);
		//segment of code is what acts on the environment
		if(sensors.doesTileHaveValue(currentNode)){
			timesToChangeValue = sensors.hyperAction();
			
			for(var i = 0 ; i < timesToChangeValue ; i++){
				graphData.valueTiles += effectors.decreaseValue(currentNode);
			}
			this.timesActed += 1;
			
		}
		//Segment in charge of movement. Uses various movement functions
		nodeValue = currentNode.index; 
		this.sensors.checkSurroundings(currentNode);
		locationChange = direction(sensors,graphData);
		
		for (i = 0; i < currentNode.neighbors.length; i += 1) {
			var indexToAdd = currentNode.neighbors[i];
			
			if (nodeValue + locationChange == indexToAdd) {
				stack.push(searchSpace[indexToAdd]);
			}
		}
		//If there are no possible movements the agent will stay in place
		if(stack.length == 0){
			stack.push(currentNode);
		}
		
		this.currentNode = stack[stack.length - 1];
		this.sensors = sensors;
		this.tiles_scanned += 1;
	
	}
	//This is the segment dicatating the agent thinks it is done acting on the environment
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
	
	/*Explanation of variables
	 * locationChange - will contain a value that states the offset in grid location from current node to desired node
	 * nodeValue - grid location of the current node
	 * searchSpace - collection of grids in the environment used for traversal
	 * rootNodeIndex - used to push current node onto stack 
	 * sensors - the sensor object the belongs to the particular agent
	 * effectors - effector object that belongs to the particular agent
	 */
    var locationChange,
		nodeValue,
		searchSpace = graphData.vertices,
		rootNodeIndex = this.currentNode.index,
		sensors = this.sensors,
		effectors = this.effectors;
		stack = new Array();
	//Agent checks if there is anything left to act on
	if(graphData.valueTiles !== 0){
		stack.push(searchSpace[rootNodeIndex]);
		currentNode = stack.pop();
		curretnNode = childInterference(graphData, currentNode);
		//acting on environment
		if(sensors.doesTileHaveValue(currentNode)){
			timesToChangeValue = sensors.hyperAction();
			
			for(var i = 0 ; i < timesToChangeValue ; i++){
				graphData.valueTiles += effectors.decreaseValue(currentNode);
			}
			
			this.timesActed += 1;
		}
		//Preparation for movement
		nodeValue = currentNode.index;
		this.sensors.checkSurroundings(currentNode);
		locationChange = lookAheadDirection(currentNode,sensors,graphData);
		//Movement
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
	/*Explanation of variables
	 * locationChange - will contain a value that states the offset in grid location from current node to desired node
	 * nodeValue - grid location of the current node
	 * searchSpace - collection of grids in the environment used for traversal
	 * rootNodeIndex - used to push current node onto stack 
	 * sensors - the sensor object the belongs to the particular agent
	 * effectors - effector object that belongs to the particular agent
	 */
    var locationChange,
		nodeValue,
		searchSpace = graphData.vertices,
		rootNodeIndex = this.currentNode.index,
		sensors = this.sensors,
		effectors = this.effectors;
    	stack = new Array();
    	
    if(graphData.valueTiles !== 0){	
    	stack.push(searchSpace[rootNodeIndex]);
    	currentNode = stack.pop();
    	currentNode = childInterference(graphData, currentNode);
    	
    	//Acting on environment
    	if(sensors.doesTileHaveValue(currentNode)){
    		timesToChangeValue = sensors.hyperAction();
    		
    		for(var i = 0 ; i < timesToChangeValue ; i++){
    			graphData.valueTiles += effectors.decreaseValue(currentNode);
    		}
    		
    		this.timesActed += 1;
    	}
    	valueInformation = sensors.valueOfNeighbors(currentNode);
    	//Preparation for movement
    	nodeValue = currentNode.index;
    	this.sensors.checkSurroundings(currentNode);
    	locationChange = lookAheadDirection(currentNode,sensors,graphData);
    	
    	if(valueInformation[0]){
    		stack.push(valueInformation[1]);
    	}
    	//If none of the neighboring tiles have a value the agent will use movement of look ahead
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
	/*Explanation of variables
	 * locationChange - will contain a value that states the offset in grid location from current node to desired node
	 * nodeValue - grid location of the current node
	 * searchSpace - collection of grids in the environment used for traversal
	 * rootNodeIndex - used to push current node onto stack 
	 * sensors - the sensor object the belongs to the particular agent
	 * miniMap - mini-map pertaining to individual agents
	 * valueInfo - array holding the values of neighboring tiles for usage with mini-map
	 * shouldLookAtMap - boolean used to indicate whether or not the agent can use their map to find a path
	 * masterMiniMap - mini-map that all of the agents use and share
	 * effectors - effector object that belongs to the particular agent
	 */
    var locationChange,
		nodeValue,
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
    	//acting on environment
    	if(sensors.doesTileHaveValue(currentNode)){
    		timesToChangeValue = sensors.hyperAction();
    		for(var i = 0 ; i < timesToChangeValue ; i++){
    			graphData.valueTiles += effectors.decreaseValue(currentNode);
    		}
    		this.timesActed += 1;
    	}
    	//Updating the mini-maps
    	valueInfo = sensors.neighboringValueInformation(currentNode);
    	miniMap.updateMiniMap(currentNode, valueInfo);
    	masterMiniMap.updateMiniMap(currentNode, valueInfo);
    	//Movement algorithm will be based on status of mini-map and direct environment.
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
    		//Part of work in progress
    		/*if(stack[stack.length - 1].valueLevel == 0){
    			shouldLookAtMap = true;
    		}*/
    	}
    	//Instructions to proceed so that the minimap is used
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
	/* neighborExistence - array containing whether neighbors exist or not. Array order is in up, left, right, down
	 * directionalData - array containing information for movement[movingRight, horizontalBumper, movingUp, verticalBumper]
	 * 					movingRight and moving Up dictate what the last movement made was to give it priority
	 * 					horizontalBumper and Vertical bumper dictates whether the agent is restricted vertically or horizontally
	 * randomFactor - used to allow vertical movement at random moments to prevent purely horizontal movement
	 * 
	 */
		var shift = 0,
			neighborExistence = sensor.neighborExistence,
			directionalData = sensor.directionalData,
			randomFactor = Math.random()*100,
			width = graphData.width;
			directionalData[1] = false;
		//used to give preference to vertical movement at random intervals opposed to horizontal movement	
		if(randomFactor < 20){
			directionalData[1] = true;
			directionalData[2] = true;
		}	
		//Right exists and left doesn't makes the agent give preference to moving right
		if(neighborExistence[2] && !neighborExistence[1]){	
			directionalData[0] = true;
			
			/*Since this if is to change directions from left and right this assumes it hit a wall
			*and will try to make a vertical movement
			*/
	    	if((neighborExistence[0] || neighborExistence[3]) && !directionalData[2]){
	    		directionalData[1] = true;
	     	}
	    	
	     }
		//left exists but right doesn't gives a preference to moving left
	     else if (!neighborExistence[2] && neighborExistence[1]){
	     	directionalData[0] = false;
	     	/*Change in direction may have been caused by hitting a wall, agent will attempt 
	     	*a vertical movement
	     	*/
	     	if((neighborExistence[0] || neighborExistence[3]) && !directionalData[2]){
	     		directionalData[1] = true;
	     	}
	     }
		//These if statements will set a direction based on preferences and restrictions
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
	/* dataPack - array of arrays used to sort arrays accordingly
	 * neighborExistence - array containing booleans pertaining to existence of neighbors [up left right down]
	 * directionalValueCounter - array containing numbers dictating the value of each direction [up left right down]
	 * preferredDirection - contains a number 0-3 dictating the direction it is currently moving in
	 * 						to give that direction preference
	 * 
	 */
	var dataPack = [],
		neighborExistence = sensor.neighborExistence,
		directionalValueCounter = sensor.directionalValueCounter,
		width = graphData.width,
		preferredDirection = sensor.preferredDirection;
		shift = 0;
	//Initialization of arrays within dataPack	
	dataPack[0] = [];
	dataPack[1] = [];
	dataPack[2] = [];
	dataPack[3] = [];
	/* length - used for the for loops pertaining to dataPack
	 * displacementData - array containing the difference between current node and nodes in the four
	 * 						directions [up left right down]
	 */
	var	length = dataPack.length,
		displacementData = [];
	//Initialization of information within displacementData
	displacementData[0] = -(width);
	displacementData[1] = -1;
	displacementData[2] = 1;
	displacementData[3] = width;
	
	/*This checks to see if there is a preferred direction the agent is moving in and if there
	* is a value in that direction to keep the agent moving in that direction.
	*/
	if(preferredDirection !== -1 && directionalValueCounter[preferredDirection] !== 0){
		return -(-displacementData[preferredDirection]);
	}
	/*Fills in dataPack with boolean stating the existence of the direction, directionalValueCounter
	* which contains the sum of values in each direction, displacementData which dictates the difference
	* between current node and desired node
	*/
	for(var i = 0 ; i < length ; i++){
		dataPack[i][0] = neighborExistence[i];
		dataPack[i][1] = directionalValueCounter[i];
		dataPack[i][2] = displacementData[i];
	}
	//This sorts the array in order of existence
	dataPack.sort(function(a,b){
		return a[0] - b[0];
	});
	//Sorts array based on value in the direction
	dataPack.sort(function(a,b){
		return a[1] - b[1];
	});
	/*if the rightmost direction (best out of the sorting) exists it gives the instructions
	 *necessary for it
	 */
	if(dataPack[length - 1][0]){
		shift -= -(dataPack[length - 1][2]);
		
		//These if statements set the preferred direction based on the direction that will be taken
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
	
	//If the best direction does not exist then a different movement algorithm will be used
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