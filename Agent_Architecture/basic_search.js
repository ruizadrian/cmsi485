
/** basic_search.js
 * 
 * @file Object intended run the module when run button is pressed
 * @author Eric Jaso
*/

/* basic_search.js
 * 
 * Description:  Object intended run the module when run button is pressed
 *
 * Created by:  @author Eric Jaso
 *
 * Change History:
 * 7-1-2013  Miguel Vazquez  Added methods to allow for four animations to act on environment
 * 7-30-2013 Miguel Vazquez  Changed variable names to be more generic so that if scenario 
 * 							 changes same variables can be used
 **********************************************************************
*/
$(function () {
    var iterationInterval,                      // interval id for running the solution animation
        mainInterval,                           // interval id for checking if search function is done
        animationPercentOfDurationToPause = 1.5,
        animationAgents = [];
        setUpAgents = function(){
    		var numberOfRoots = $('#quantity option:selected').val();
    		for(var i = 0 ; i < numberOfRoots ; i++){
    			this.animationAgents[i] = new Animate("#sprite" + i);
    		} 
    	}
        
        //graph = new Graph("#map"),

		moveSpriteTo = function (newTop, newLeft, number) {
        	$("#sprite" + number).css('top', newTop + 'px');
			$("#sprite" + number).css('left', newLeft + 'px');
		},
 
        // Helper object for checking when search portion of program is complete.
        WaitFlag = function (startValue) {
            this.value = startValue;
        },
        
        /**
         * Prepares the environment and agents for use
         * @method basic_search#runProgram
         */
		runProgram = function () {
		    var searchPortionStarted = false,
		        searchPortionFinished = new WaitFlag(false);

	        setupGraphVisuals();

	        //runs the program
            mainInterval = setInterval(function() {
                if (!searchPortionStarted) {    
                	Environment.runAgents(graph);
                    searchPortionStarted = !searchPortionStarted;
                }
                if (searchPortionFinished.value) {          
                    clearInterval(mainInterval);
                }
            }, 500);
        },

        // Clears and draws the graph on the page.
        setupGraphVisuals = function () {
            // Clear the previous graph
            clearPreviousGraphVisuals();
            
            graph = new Graph("#map");
            graph.createEntireGraph(5);
            graph.enableVertexHoverText();
            graph.enableColorClick(graph);
            graph.enableCleanClick(graph);
            graph.enableObstacleRemoval(graph);
            graph.initializeEdges();
            prepareRoots(graph);
            moveSprites(graph);
        },
        
        /**
         * Prepares the roots so that multiple agents can be set up easily
         * @method basic_search#prepareRoots
         * @param {graph} graph this is the HTML Element that will be acted upon
         */
        prepareRoots = function(graph){
        	var numberOfRoots = $('#quantity option:selected').val(),
        		lowestAvailableSpace = 0,
        		length = graph.length,
        		width = graph.width;
        	
        	for(var i = 0 ; i < numberOfRoots ; i++){
        		graph.roots[i] = document.getElementById("start" + i).value;
        		
        		
        		for(var j = 0 ; j < i ; j++){
        			if(lowestAvailableSpace == graph.roots[j]){
        				lowestAvailableSpace += 1;
        			}
        			if(graph.roots[i] == graph.roots[j]){
        				graph.roots[i] = lowestAvailableSpace;
        				lowestAvailableSpace += 1;
        			}
        		}
        		while(graph.vertices[lowestAvailableSpace].isObstacle){
            		lowestAvailableSpace += 1;
            	}
        		
        		if(graph.roots[i] > length * width - 1){
        			graph.roots[i] = lowestAvailableSpace;
					lowestAvailableSpace += 1;
        		}
        		if(graph.vertices[graph.roots[i]].isObstacle){
        			graph.roots[i] = lowestAvailableSpace;
        			lowestAvailableSpace += 1;
        		}
        	}
        },
        
        /**
         * Moves Html Elements that represent agents onto the environment
         * @method basic_search#moveSprites
         * @param {graph} graph this is the HTML Element that will be acted upon
         */
        moveSprites = function(graph){
        	var numberOfRoots = $('#quantity option:selected').val();
        	
        	for(var i = 0 ; i < 4 ; i++){
        		moveSpriteTo(335 , 5 , i);
        	} 
        	
        	for(var i = 0 ; i < numberOfRoots ; i++){
        		moveSpriteTo(graph.vertices[graph.roots[i]].y + 10,graph.vertices[graph.roots[i]].x + 2 , i);
        	} 
        }
        
        /**
         * Function to clear the previously done animations.
         * @method basic_search#clearPreviousGraphVisuals
         */
        clearPreviousGraphVisuals = function () {
            $("#map > .vertex").remove();
            $("#map > .valueDisplay").remove();
            $(".edge").remove();
            
            $("#miniMap0 > .vertex").remove();
            $("#miniMap0 > .valueDisplay").remove();
            $("#miniMap1 > .vertex").remove();
            $("#miniMap1 > .valueDisplay").remove();
            $("#miniMap2 > .vertex").remove();
            $("#miniMap2 > .valueDisplay").remove();
            $("#miniMap3 > .vertex").remove();
            $("#miniMap3 > .valueDisplay").remove();
            $("#miniMap4 > .vertex").remove();
            $("#miniMap4 > .valueDisplay").remove();
        };

    // Setup the graph for the first loading of this web page.
    setupGraphVisuals();


    /**
     * Makes necessary resets and runs program
     */
    $("#run").click(function () {
        // If a previous search is still in progress, clear the necessary
        // intervals.
        if (mainInterval) {
            clearInterval(mainInterval);
            clearInterval(movementInterval);
            mainInterval = null;
            movementInterval = null;
        }
        // If a previous animation is still running, clear the interval.
        if (iterationInterval) {
            clearInterval(iterationInterval);
            iterationInterval = null;
        }
        runProgram();
    });
    
});
