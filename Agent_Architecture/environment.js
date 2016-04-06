
/** environment.js
 * 
 * @file Object intended to be used by agent to act on the environment
 *
 * @author Miguel Vazquez
 *
 * @version 3
*/

/* environment.js
 * 
 * Description:  Object intended to be used by agent to act on the environment
 *
 * Created by:  @author Miguel Vazquez     Date:  7-8-2013
 *
 * Change History:
 * 7-8-2013  Miguel Vazquez  .Initial version.
 * 7-30-2013 Miguel Vazquez  Changed variable names and file name to be more generic so that if scenario 
 * 							 changes same variables can be used
 **********************************************************************
*/

/**
 * @constructor Environment
 */

var Environment = function () {
};

var movementInterval,
animationAgent = new Animate("#sprite");
animationAgents = [];

setUpAgents = function(){
	var numberOfRoots = $('#quantity option:selected').val();
	for(var i = 0 ; i < numberOfRoots ; i++){
		this.animationAgents[i] = new Animate("#sprite" + i);
	} 
}

/**
 * makes necessary preparations for agents to work properly and then continuously runs them until they all report as done
 * @method Environment#runAgents
 * @param {graph} graphData Graph that will be acted on
 */
Environment.runAgents = function (graphData){
    var agents = [],
		rootNodes = graphData.roots,
		selectedMovementTypes = [],
		numberOfAgents = $('#quantity option:selected').val(),
		running,
		masterGraph = graphData,
		miniGraph = new MiniGraph(masterGraph, 4);

    for(var i = 0 ; i < numberOfAgents ; i++){
    	agents[i] = new Agent(graphData, i, rootNodes[i], miniGraph);
    }
    
    for(var i = 0 ; i < numberOfAgents ; i++){
    	agents[i].partnerConnection(agents);
    }
    
    setUpAgents();
    valueTiles(graphData);
    movementInterval = setInterval(function() {
    	running = anyAgentsRunning(agents);
    	untouchable = untouchableValue(agents, graphData)
    	if (!running || untouchable) {
    		// Success!
    		clearInterval(movementInterval);
    		movementInterval = null;
    		for(var i = 0; i < numberOfAgents ; i++){
    			animationAgents[i].animateTo(agents[i].currentNode.x + 2, agents[i].currentNode.y + 10);
    		}
    		showResults(agents, graphData);
    	} 
    	else {
    		for(var i = 0 ; i < numberOfAgents ; i++){
    			var string = '#roomTraversal' + i + ' option:selected';
    			agents[i][$(string).val()](graphData);
    		}
    	}
    	for(var i = 0 ; i < numberOfAgents ; i++){
    		animationAgents[i].animateTo(agents[i].currentNode.x + 2, agents[i].currentNode.y + 10);
    	}
    	childAtPlay(graphData);
    }, 100);
};
    
/**
 * Will attempt to give random vertices a value a certain number of times
 * @method Environment#valueTiles
 * @param {graph} graphData Graph that will be acted on
 */
    valueTiles = function (graphData) {
    	var numberToValue = document.getElementById("value").value,
    		verticesNumber = graphData.vertices.length,
    		tileToValue = 0;
    	for(var i = 0 ; i < numberToValue ; i++){
    		tileToValue = Math.floor(Math.random()*(verticesNumber));
    		while(graphData.vertices[tileToValue].isObstacle){
    			tileToValue = Math.floor(Math.random()*(verticesNumber));
    		}
    		graphData.valueTiles += graphData.vertices[tileToValue].colorAsValue();
    	}
    };
    
    /**
     * Will choose a random vertex and in increment its value
     * @method Environment#childAtPlay
     * @param {graph} graphData Graph that will be acted on
     */
    childAtPlay = function (graphData){
    	var tileToValue = 0,
    		verticesNumber = graphData.vertices.length,
    		childAtPlayPercentage = document.getElementById("childPlayValue").value;
    	if(Math.random()*100 < childAtPlayPercentage && document.getElementById("childPlay").checked){
    		tileToValue = Math.floor(Math.random()*(verticesNumber));
    		while(graphData.vertices[tileToValue].valueLevel == -1){
    			tileToValue = Math.floor(Math.random()*(verticesNumber))
    		}
    		graphData.valueTiles += graphData.vertices[tileToValue].childrenAtPlay();
    	}
    }
    
    /**
     * Checks to see if any of the agents are still running
     * @method Environment#anyAgentsRunning
     * @param {Agent[]} agents array holding all of the agents that are used
     * @returns {boolean} Value states whether any agent is still acting on the environment or not
     */
    anyAgentsRunning = function (agents){
    	var counter = 0,
    		agentLength = agents.length;
    	for( var i = 0 ; i < agentLength ; i++){
    		if(!agents[i].stillRunning){
    			counter += 1;
    		}
    	}
    	if(counter == agents.length){
    		return false;
    	}
    	return true;
    }
    
    /**
     * Creates an alert that show the performance on the agents on the environment they were acting on
     * @method Environment#showResults
     * @param {Agent[]} agents Array holding all of the agents that are used
     * @param {graph} graphData Graph that will be acted on
     */
    showResults = function(agents, graphData){
    	var tiles_scanned = 0,
    		agentLength = agents.length,
    		timesActed = 0;
    	for( var i = 0 ; i < agentLength ; i++){
    		tiles_scanned += agents[i].tiles_scanned;
    		timesActed  += agents[i].timesActed;
    	}
    	
    	alert("The program has ended \nIt scanned " + tiles_scanned + " tiles \nIt acted on " + timesActed + " tiles \nIt has left the environment with a value of " + graphData.valueTiles);
    }
    
    /**
     * Checks to see if any values in the environment are trapped under an agent that is no longer acting on the environment
     * @method Environment#untouchableValue
     * @param {Agent[]} agents Array holding all of the agents that are used
     * @param {graph} graphData Graph that will be acted on
     * @returns {boolean} States whether the last values on the environment are trapped under an agent
     */
    untouchableValue = function(agents, graphData){
    	var counter = 0,
    		agentLength = agents.length;
    	for( var i = 0 ; i < agentLength ; i++){
    		counter += agents[i].leftOverValue;
    	}
    	if(graphData.valueTiles - counter == 0){
    		return true;
    	}
    	else{
    		return false;
    	}
    }