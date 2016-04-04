
/**
 * search.js
 * 
 * This Search package is created specifically to work with the "graph"
 * object in the basic_search.js file. Each search function takes in a
 * instance of class Graph from graph.js along with an instance of a WaitFlag.
 * the WaitFlag is used to let runProgram in basic_search.js to end the
 * interval and to move on to the solution animation. 
 *
 * @author Andrew Won
 * @author Eric Jaso
 * 
 *  Change History:
 * 7-22-2013 Miguel Vazquez  Changed beam search a bit to make it work with minimap made by the agents
 */

/**
 * Empty object used for searching the miniGraph objects
 * @constructor Search
 */

var Search = function () {
};

// Need this to be public for interval id
var searchInterval;

Search.getArrayGivenSizeAndInputs = function (size, inputs) {
    array = new Array();

    for (i = 0; i < size; i += 1) {
        array.push(inputs);
    }
    return array;
};

Search.depthFirst = function (graphData, waitFlag) {
    var currentNode,
        searchSpace = graphData.vertices,
        goalNodeIndex = graphData.goal,
        rootNodeIndex = graphData.root,
        visitedLocationIndices,
        searchOrder = new Array(),
        stack = new Array(),
        searchTree = new SearchTree("#searchtree");
    
    // vars for search tree building
    var pathNames = new Array(),
        closed = Search.getArrayGivenSizeAndInputs(searchSpace.length, false),
        currentPath;

    searchTree.setUpRootNode(searchSpace[rootNodeIndex].name);

    visitedLocationIndices = Search.getArrayGivenSizeAndInputs(searchSpace.length, false);

    stack.push(searchSpace[rootNodeIndex]);
    pathNames.push(searchSpace[rootNodeIndex].name);
    visitedLocationIndices[rootNodeIndex] = true;
    
    searchInterval = setInterval(function() {
        // First check we haven't reached end of the possible search space.
        if (stack.length == 0) {
            clearInterval(searchInterval);
            searchInterval = null;
            waitFlag.value = true;
        }
        currentNode = stack.pop();
        currentPath = pathNames.pop();
        searchOrder.push(currentNode.index);
        
        if (currentNode.index == goalNodeIndex) {
            // Success!
            graphData.solutionPath = currentPath;
            clearInterval(searchInterval);
            searchInterval = null;
            waitFlag.value = true;
            currentNode.colorAsSearched();
            showFinalPath(currentPath, graphData);
        } else {
	        for (i = 0; i < currentNode.neighbors.length; i += 1) {
	            var indexToAdd = currentNode.neighbors[i];
	            if (!closed[indexToAdd]) {
	                searchTree.addSearchTreeVertex(currentPath, searchSpace[indexToAdd].name); //Add node to search tree
	            }
	            if (!visitedLocationIndices[indexToAdd] || !closed[indexToAdd]) {
	                stack.push(searchSpace[indexToAdd])    // THIS IS THE LINE TO REMOVE FOR DEPTH EXERCISE
	                pathNames.push(currentPath.concat("-" + searchSpace[indexToAdd].name));
	                visitedLocationIndices[indexToAdd] = true;
	            }
	        }
	        currentNode.colorAsSearched();
	        flashPathText(currentPath, graphData);
        }
        searchTree.draw();
        // Show which Node is being expanded on the search tree
        searchTree.vertices[searchTree.map[currentPath]].colorAsSearched();
        closed[currentNode.index] = true;
    }, 1500);  
};

Search.breadthFirst = function (graphData, waitFlag) {
    var currentNode,
        searchSpace = graphData.vertices,
        goalNodeIndex = graphData.goal,
        rootNodeIndex = graphData.root,
        visitedLocationIndices,
        searchOrder = new Array(),
        queue = new Array(),
        searchTree = new SearchTree("#searchtree");
    
    // vars for search tree building
    var pathNames = new Array(),
        closed = Search.getArrayGivenSizeAndInputs(searchSpace.length, false),
        currentPath;

    searchTree.setUpRootNode(searchSpace[rootNodeIndex].name);

    visitedLocationIndices = Search.getArrayGivenSizeAndInputs(searchSpace.length, false);
    
    queue.unshift(searchSpace[rootNodeIndex]);
    pathNames.unshift(searchSpace[rootNodeIndex].name);
    visitedLocationIndices[rootNodeIndex] = true;
    searchInterval = setInterval(function() {
        // Check to make sure we haven't reached the end of the possible search space. 
        if (queue.length == 0) {
            clearInterval(searchInterval);
            searchInterval = null;
            waitFlag.value = true;
        }
        currentNode = queue.pop();
        currentPath = pathNames.pop();
        searchOrder.push(currentNode.index);
        if (currentNode.index == goalNodeIndex) {
            //Success!
            graphData.solutionPath = currentPath;
            clearInterval(searchInterval);
            searchInterval = null;
            waitFlag.value = true;
            currentNode.colorAsSearched();
            showFinalPath(currentPath, graphData);
        } else {
	        for (i = 0; i < currentNode.neighbors.length; i += 1) {
	            var indexToAdd = currentNode.neighbors[i];
	            if ( !(existsInPath(graphData.vertices[currentNode.neighbors[i]].name, currentPath)))  {
	                searchTree.addSearchTreeVertex(currentPath, searchSpace[indexToAdd].name); //Add node to search tree
	            }
	            if (!visitedLocationIndices[indexToAdd] || !(existsInPath(searchSpace[indexToAdd].name, currentPath))) {
	                queue.unshift(searchSpace[indexToAdd]);  // THIS IS THE LINE TO REMOVE FOR BREADTH EXERCISE
	                pathNames.unshift(currentPath.concat("-" + searchSpace[indexToAdd].name));
	                visitedLocationIndices[indexToAdd] = true;
	            }
	        }
	        currentNode.colorAsSearched();
	        flashPathText(currentPath, graphData);
    	}
        searchTree.draw();
        // Show which Node is being expanded on the search tree
        searchTree.vertices[searchTree.map[currentPath]].colorAsSearched();
        closed[currentNode.index] = true;
    }, 1500);
};

Search.nonDeterministic = function (graphData, waitFlag) {
    var currentNode,
        searchSpace = graphData.vertices,
        goalNodeIndex = graphData.goal,
        rootNodeIndex = graphData.root,
        visitedLocationIndices,
        searchOrder = new Array(),
        queue = new Array(),
        searchTree = new SearchTree("#searchtree");

    // vars for search tree building
    var pathNames = new Array(),
        closed = Search.getArrayGivenSizeAndInputs(searchSpace.length, false),
        currentPath;

    searchTree.setUpRootNode(searchSpace[rootNodeIndex].name);

    visitedLocationIndices = Search.getArrayGivenSizeAndInputs(searchSpace.length, false);

    queue.push(searchSpace[rootNodeIndex]);
    pathNames.push(searchSpace[rootNodeIndex].name);
    visitedLocationIndices[rootNodeIndex] = true;

    searchInterval = setInterval(function() {
        // Check to make sure we haven't reached the end of the possible search space.
        if (queue.length == 0) {
            clearInterval(searchInterval);
            searchInterval = null;
            waitFlag.value = true;
        }
        currentNode = queue.pop();
        currentPath = pathNames.pop();
        searchOrder.push(currentNode.index);
        if (currentNode.index == goalNodeIndex) {
            //Success!
            graphData.solutionPath = currentPath;
            clearInterval(searchInterval);
            searchInterval = null;
            waitFlag.value = true;
            currentNode.colorAsSearched();
            showFinalPath(currentPath, graphData);
        } else {
	        for (i = 0; i < currentNode.neighbors.length; i += 1) {
	            var indexToAdd = currentNode.neighbors[i],
	                randomSeed = Math.floor(Math.random() * (queue.length + 1));  // Can remove to eliminate random seed
	            
	            if (!(existsInPath(graphData.vertices[currentNode.neighbors[i]].name, currentPath))) {
	                searchTree.addSearchTreeVertex(currentPath, searchSpace[indexToAdd].name); //Add node to search tree
	            }
	            if (!visitedLocationIndices[indexToAdd] || !(existsInPath(searchSpace[indexToAdd].name, currentPath))) {
	                queue.splice(randomSeed, 0, searchSpace[indexToAdd]);      // Or, can remove this 
	                pathNames.splice(randomSeed, 0, currentPath.concat("-" + searchSpace[indexToAdd].name));
	                visitedLocationIndices[indexToAdd] = true;
	            }
	        }
	        currentNode.colorAsSearched();
	        flashPathText(currentPath, graphData);
        }
        searchTree.draw();
        // Show which Node is being expanded on the search tree
        searchTree.vertices[searchTree.map[currentPath]].colorAsSearched();
        closed[currentNode.index] = true;
    }, 1500);
};

Search.hillClimbing = function (graphData, waitFlag) {
    var currentNode,
        childArrayToSort,
        searchSpace = graphData.vertices,
        goalNodeIndex = graphData.goal,
        rootNodeIndex = graphData.root,
        visitedLocationIndices,
        searchOrder = new Array(),
        queue = new Array();
        searchTree = new SearchTree("#searchtree");

    // vars for search tree building
    var pathNames = new Array(),
        closed = Search.getArrayGivenSizeAndInputs(searchSpace.length, false),
        currentPath;

    searchTree.setUpRootNode(searchSpace[rootNodeIndex].name);

	visitedLocationIndices = Search.getArrayGivenSizeAndInputs(searchSpace.length, false);
	graphData.setHeuristicValuesForVertices();
    graphData.displayVertexValues();

    queue.push(searchSpace[rootNodeIndex]);
    pathNames.push(searchSpace[rootNodeIndex].name);
    visitedLocationIndices[rootNodeIndex] = true;
    
    searchInterval = setInterval(function() {
        if (queue.length == 0) {
            clearInterval(searchInterval);
            searchInterval = null;
            waitFlag = true;
        }
        currentNode = queue.pop();
        currentPath = pathNames.pop();
        searchOrder.push(currentNode.index);
        childArrayToSort = new Array();
        if (currentNode.index == goalNodeIndex) {
            //Success!
            graphData.solutionPath = currentPath;
            clearInterval(searchInterval);
            searchInterval = null;
            waitFlag.value = true;
            currentNode.colorAsSearched();
            showFinalPath(currentPath, graphData);
        } else {
	        for (i = 0; i < currentNode.neighbors.length; i += 1) {
	            var indexToAdd = currentNode.neighbors[i];
	            if (!closed[indexToAdd]) {
	                searchTree.addSearchTreeVertex(currentPath, searchSpace[indexToAdd].name); //Add node to search tree
	            }
	            if (!visitedLocationIndices[indexToAdd] || !closed[indexToAdd]) {
	                childArrayToSort.push(searchSpace[indexToAdd]);					// pushes verticies to the childArray
	                visitedLocationIndices[indexToAdd] = true;
	            }
	        }
	        childArrayToSort.sort(function (a, b) {									// sorts them by value and then attaches them to the top of the queue
	                                 return b.value - a.value;
	                              });
	        for (i = 0; i < childArrayToSort.length; i += 1) {
	            pathNames.push(currentPath.concat("-" + childArrayToSort[i].name));
	        }
	        queue = queue.concat(childArrayToSort); 								
	        currentNode.colorAsSearched();
	        flashPathText(currentPath, graphData);
        }
        searchTree.draw();
        // Show which Node is being expanded on the search tree
        searchTree.vertices[searchTree.map[currentPath]].colorAsSearched();
        closed[currentNode.index] = true;
    }, 1500);
};

Search.bestFirst = function (graphData, waitFlag) {
    var currentNode,
        searchSpace = graphData.vertices,
        goalNodeIndex = graphData.goal,
        rootNodeIndex = graphData.root,
        visitedLocationIndices,
        searchOrder = new Array(),
        queue = new Array(),
        searchTree = new SearchTree("#searchtree");

    // vars for search tree building
    var closed = Search.getArrayGivenSizeAndInputs(searchSpace.length, false),
        currentPath;

    searchTree.setUpRootNode(searchSpace[rootNodeIndex].name);

    searchSpace[rootNodeIndex].pathName = searchSpace[rootNodeIndex].name;

	visitedLocationIndices = Search.getArrayGivenSizeAndInputs(searchSpace.length, false);
    graphData.setHeuristicValuesForVertices();
    graphData.displayVertexValues();

    queue.push(searchSpace[graphData.root]);
    visitedLocationIndices[graphData.root] = true;

    searchInterval = setInterval(function() {
        if (queue.length == 0) {
            clearInterval(searchInterval);
            searchInterval = null;
            waitFlag = true;
        }
        currentNode = queue.pop();
        currentPath = currentNode.pathName;
        searchOrder.push(currentNode.index);
        if (currentNode.index == goalNodeIndex) {
            //Success!
            graphData.solutionPath = currentPath;
            clearInterval(searchInterval);
            searchInterval = null;
            waitFlag.value = true;
            currentNode.colorAsSearched();
            showFinalPath(currentPath, graphData);
        } else {
	        for (i = 0; i < currentNode.neighbors.length; i += 1) {
	            var indexToAdd = currentNode.neighbors[i];
	            if (!closed[indexToAdd] ) {
	                searchTree.addSearchTreeVertex(currentPath, searchSpace[indexToAdd].name); //Add node to search tree
	            }
	            if (!visitedLocationIndices[indexToAdd] || !closed[indexToAdd]) {
	                queue.push(searchSpace[indexToAdd]);													// pushes a vertex to queue
	                searchSpace[indexToAdd].pathName = currentPath + "-" + searchSpace[indexToAdd].name;
	                visitedLocationIndices[indexToAdd] = true;
	            }
	        }
	        queue.sort(function (a, b) {																// sorts queue
	                                 return b.value - a.value;
	                             });
	        currentNode.colorAsSearched();
	        flashPathText(currentPath,graphData);
	    }
        searchTree.draw();
        // Show which Node is being expanded on the search tree
        searchTree.vertices[searchTree.map[currentPath]].colorAsSearched();
        closed[currentNode.index] = true;
    }, 1500);
};

Search.beam = function (graphData, rootNodeIndex) {
		var beamSize = 2,
        	searchSpace = graphData.vertices,
        	goalNodeIndex = graphData.goal,
        	currentNode, 
        	currentPathData,
        	nodesToConsider,
        	beam = new Array();

		// vars for search tree building
		var pathNames = new Array(),
    		closed = Search.getArrayGivenSizeAndInputs(searchSpace.length, false),
    		currentPath = [],
    		searchInterval;

		searchSpace[rootNodeIndex].pathName = searchSpace[rootNodeIndex].name;

		visitedLocationIndices = Search.getArrayGivenSizeAndInputs(searchSpace.length, false);
		graphData.setHeuristicValuesForVertices();
    
		var pathData = new Array();
		pathData.push(searchSpace[rootNodeIndex].name);
		pathData.push(searchSpace[rootNodeIndex]);

		beam.unshift(pathData);
		visitedLocationIndices[graphData.root] = true;
		searchInterval = setInterval(function() {
			if (beam.length == 0) {
				clearInterval(searchInterval);
				searchInterval = null;
			}
        
			nodesToConsider = new Array();
			var beamLength = beam.length;
			for ( var z = 0; z < beamLength; z++ ) {
				currentPathData = beam.pop();
				currentNode = currentPathData[1];
				currentPath = currentPathData[0] + "";

				if (currentNode.index == goalNodeIndex) {
					//Success!
					graphData.solutionPath = currentPath;
					clearInterval(searchInterval);
					searchInterval = null;
					graphData.pathExists = true
					break;
				}
				else {
					for ( var i = 0; i < currentNode.neighbors.length; i += 1) {
						var indexToAdd = currentNode.neighbors[i],
							newPathData = new Array();
			        
			        
						if (!closed[indexToAdd] && !(existsInPath(searchSpace[indexToAdd], currentPath)) && searchSpace[indexToAdd].valueLevel !== -1) {
							newPathData.push(currentPath.concat("-" + searchSpace[indexToAdd].name));
							newPathData.push(searchSpace[indexToAdd]);
							nodesToConsider.unshift(newPathData);
						}
					}
				}
			}
			if (!(currentNode.index == goalNodeIndex)) {
				beam = nodesToConsider;
				beam.sort(function (a, b) {
					return b[1].value - a[1].value;
				});
				if ( beam.length - beamSize > 0 ) {
					beam = beam.slice(beam.length - beamSize);
				}
			} 
			closed[currentNode.index] = true;
		}, 1); 
};

/**
 * Performs an A* search utilizing a simple straight-line distance
 * heuristic upon a given searchSpace.
 *
 * @param goalNodeIndex index within search space of goal node
 * @param rootNodeIndex index within search space of root node
 * @param searchSpace array of City objects
 *
 * @return If path from start to goal node exists, ordered array of searchSpace
 *         indices constructing optimal path, otherwise an empty array
 */
/*
Search.aStar = function (graphData, waitFlag) {
    var currentNode,
        childArrayToSort,
        gScore,
        searchSpace = graphData.vertices,
        goalNodeIndex = graphData.goal,
        rootNodeIndex = graphData.root,
        visitedLocationIndices,
        searchOrder = new Array(),
        queue = new Array(),
        currentDataSet = new Array();
        searchTree = new SearchTree("#searchtree");
        
    // vars for search tree building
    searchSpace[rootNodeIndex].pathName = searchSpace[rootNodeIndex].name;

    searchTree.setUpRootNode(searchSpace[rootNodeIndex].name);

	visitedLocationIndices = Search.getArrayGivenSizeAndInputs(searchSpace.length, false);
	graphData.setHeuristicValuesForVertices();
    graphData.displayVertexValues();
    graphData.displayEdgeValues();
    
    currentDataSet[0] = graphData.vertices[rootNodeIndex];
    currentDataSet[1] = 0;
    currentDataSet[2] = 0;
    queue.push(currentDataSet);
    visitedLocationIndices[rootNodeIndex] = true;
    
    searchInterval = setInterval(function() {
        if (queue.length == 0) {
            clearInterval(searchInterval);
            searchInterval = null;
            waitFlag = true;
        }
        currentDataSet = queue.pop();
        currentNode = currentDataSet[0];
        gScore = currentDataSet[2];
        currentPath = currentNode.pathName;
        searchOrder.push(currentNode.index);
        childArrayToSort = new Array();
        if (currentNode.index == goalNodeIndex) {
            //Success!
            graphData.solutionPath = currentPath;
            clearInterval(searchInterval);
            searchInterval = null;
            waitFlag.value = true;
            currentNode.colorAsSearched();
            showFinalPath(currentPath, graphData);
        } else {
	        for (i = 0; i < currentNode.neighbors.length; i += 1) {
	            var indexToAdd = currentNode.neighbors[i];
	            if (!closed[indexToAdd] && !(existsInPath(graphData.vertices[currentNode.neighbors[i]].name, currentPath))) {
	                searchTree.addSearchTreeVertex(currentPath, searchSpace[indexToAdd].name); //Add node to search tree
	            }
	            if (!visitedLocationIndices[indexToAdd] && !closed[indexToAdd]) {
	            	currentDataSet[0] = searchSpace[indexToAdd];
	            	currentDataSet[1] = gScore + graphData.returnEdge(currentNode, searchSpace[indexToAdd]) + searchSpace[indexToAdd].value;
	            	currentDataSet[2] = gScore + graphData.returnEdge(currentNode, searchSpace[indexToAdd])
	            	childArrayToSort.push(currentDataSet);
	            	searchSpace[indexToAdd].pathName = currentPath + "-" + searchSpace[indexToAdd].name;
	                //searchSpace[indexToAdd].colorAsOpen();
	                visitedLocationIndices[indexToAdd] = true;
	                currentDataSet = [];
	            }
	        }
	        childArrayToSort.sort(function (a, b) {
	                                 return (b[1]) - (a[1]);
	        });
	        queue = queue.concat(childArrayToSort);
	        
	        queue.sort(function (a, b) {
	            return (b[1]) - (a[1]);
	        });
	        currentNode.colorAsSearched();
	        flashPathText(currentPath, graphData);
	    }
        searchTree.draw();
        // Show which Node is being expanded on the search tree
        searchTree.vertices[searchTree.map[currentPath]].colorAsSearched();
        closed[currentNode.index] = true;
    }, 1500);
};*/

/**
 *  Helper for showing the currently paths being considered in the search tree.
 *  @method Search#showTextForDuration
 *  @param {string} text Path that will appear for certain amount of time
 *  @param {number} duration States how long the text will be shown
 */
var showTextForDuration = function (text, duration) {
        $("#partialPath")
            .stop(true, true)
            .empty()
            .css("opacity", "1.0")
            .html(text);
        if (duration) {
            $("#partialPath").animate({opacity: 0.0}, duration);
        }
    },

    flashPathText = function (text, graphData) {
    	var pathNodes = text.split("-"),
    		pathLength = pathNodes.length,
    		verticesNumber = graphData.vertices.length,
    		previousIndex;
    	for ( var i = 0; i < pathLength; i++ ) {   // for each city name in the current path
    		for ( var j = 0; j < verticesNumber; j++ ){ // for each vertex in the graph    			
    			if ( (pathNodes[i] == graphData.vertices[j].name) && (!(i==0))) { // find the index of the vertex in the graph that corresponds to the next name in the current path
    				graphData.vertices[j].colorAsCurrentPath(); // color the vertex as part of the current path
    				graphData.getEdgeByIndex(previousIndex, j).colorAsCurrentPath();
    				previousIndex = j;
    			} else if (pathNodes[i] == graphData.vertices[j].name) {
    				graphData.vertices[j].colorAsCurrentPath();
    				previousIndex = j;
    			}
    		}
    	}
        showTextForDuration(text, 1000);
        setTimeout(function() {
        	for ( var i = 0; i < pathLength; i++ ) {   // for each city name in the current path
        		for ( var j = 0; j < verticesNumber; j++ ){ // for each vertex in the graph    			
        			if ( (pathNodes[i] == graphData.vertices[j].name) && (!(i==0))) { // find the index of the vertex in the graph that corresponds to the next name in the current path
        				graphData.vertices[j].colorAsSearched(); // color the vertex as part of the current path
        				graphData.getEdgeByIndex(previousIndex, j).colorAsUnsearched();
        				previousIndex = j;
        			} else if (pathNodes[i] == graphData.vertices[j].name) {
        				graphData.vertices[j].colorAsSearched();
        				previousIndex = j;
        			}
        		}
        	}
        }, 1000);
    },
    
    flashBeam = function (text, graphData) {
    	var pathNodes = text.split("-"),
    		pathLength = pathNodes.length,
    		verticesNumber = graphData.vertices.length,
    		previousIndex;
    	for ( var i = 0; i < pathLength; i++ ) {   // for each city name in the current path
    		for ( var j = 0; j < verticesNumber; j++ ){ // for each vertex in the graph    			
    			if ( (pathNodes[i] == graphData.vertices[j].name) && (!(i==0))) { // find the index of the vertex in the graph that corresponds to the next name in the current path
    				graphData.vertices[j].colorAsCurrentPath(); // color the vertex as part of the current path
    				graphData.getEdgeByIndex(previousIndex, j).colorAsCurrentPath();
    				previousIndex = j;
    			} else if (pathNodes[i] == graphData.vertices[j].name) {
    				graphData.vertices[j].colorAsCurrentPath();
    				previousIndex = j;
    			}
    		}
    	}
        setTimeout(function() {
        	for ( var i = 0; i < pathLength; i++ ) {   // for each city name in the current path
        		for ( var j = 0; j < verticesNumber; j++ ){ // for each vertex in the graph    			
        			if ( (pathNodes[i] == graphData.vertices[j].name) && (!(i==0))) { // find the index of the vertex in the graph that corresponds to the next name in the current path
        				graphData.vertices[j].colorAsSearched(); // color the vertex as part of the current path
        				graphData.getEdgeByIndex(previousIndex, j).colorAsUnsearched();
        				previousIndex = j;
        			} else if (pathNodes[i] == graphData.vertices[j].name) {
        				graphData.vertices[j].colorAsSearched();
        				previousIndex = j;
        			}
        		}
        	}
        }, 3000);
    },
    
    showFinalPath = function (text, graphData) {
    	var pathNodes = text.split("-"),
			pathLength = pathNodes.length,
			verticesNumber = graphData.vertices.length,
			previousIndex;
		for ( var i = 0; i <= pathLength; i++ ){
			for (var j = 0; j < verticesNumber; j++ ){
				if ( (pathNodes[i] == graphData.vertices[j].name) && (!(i==0))) { // find the index of the vertex in the graph that corresponds to the next name in the current path
    				graphData.vertices[j].colorAsFinal(); // color the vertex as part of the current path
    				graphData.getEdgeByIndex(previousIndex, j).colorAsFinal();
    				previousIndex = j;
    			} else if (pathNodes[i] == graphData.vertices[j].name) {
    				graphData.vertices[j].colorAsFinal();
    				previousIndex = j;
    			}
			}
		}
        showTextForDuration("FINAL PATH: " + text, null);
    };
    
    existsInPath = function (name, path) {
    	var pathSplit = path.split("-"),
    	    pathLength = pathSplit.length,
    	    k;
    	for( k = 0 ; k < pathLength ; k++){
    		if(name == pathSplit[k]) return true;
    	}
    	return false;
    };
