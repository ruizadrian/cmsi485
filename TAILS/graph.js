
/** graph.js
 * 
 * @file A class for helping to build and display graphs on a web page.
 *
 * @author Eric Jaso
 *
 * @version 3
*/

/* graph.js
 * 
 * Description:  A class for helping to build and display graphs on a web page.
 *
 * Created by:  @author Eric Jaso
 *
 * Change History:
 * 7-22-2013 Miguel Vazquez  added function createEntireGraph to better created the environment 
 * 7-30-2013 Miguel Vazquez  Changed variable names to be more generic so that if scenario 
 * 							 changes same variables can be used
 **********************************************************************
*/

/**
 * @constructor Graph
 * @param {htmlContainer} htmlContainer HTML element that will be where graph is placed
 * @property {HTMLElement} htmlContainer HTML element that will be where graph is placed
 * @property {Vertex[]} vertices Array holding all the vertices related to this object
 * @property {Edge[]} edges Array holding all edges related to this object
 * @property {Vertex[]} verticesToEdge Array with vertices that will have and edge connected 
 * @property {Vertex[]} roots Array holding the vertices the agents should be starting on
 * @property {String} solutionPath String that will contain the path the agent should follow to get to a vertex with value that it knows of
 * @property {number} vertexIndex Counter for the vertices
 * @property {number} edgeIndex Counter for edges
 * @property {number} width Width of the graph
 * @property {number} length Length of the graph
 * @property {number} valueTiles Total value of the tiles existing in this graph
 * @property {number} goal Value of the vertex agent is trying to get to
 * @property {boolean} pathExists States whether the agent is following a path it used search for or not
 */

var Graph = function (htmlContainer) {
    this.htmlContainer = htmlContainer;
    this.vertices = [];
    this.edges = [];
    this.verticesToEdge = [];
    this.roots = [];
    this.solutionPath = "";
    this.vertexIndex = 0;
    this.edgeIndex = 0;
    this.width;
    this.length;
    this.valueTiles = 0;
    this.goal;
    this.pathExists = false;
};

/**
 * Creates a graph of vertices with a certain length and width. Also connects each vertex to its proper neighbor
 * @method Graph.createEntireGraph
 * @param {number} index The index number of this graph
 */
Graph.prototype.createEntireGraph = function(index){
	var xCoord = 200,
	yCoord = 10,
	xOrigin = 200,
	xyDelta = 50,
	width = $('#width option:selected').val(),
	length = $('#length option:selected').val(),
	up = 0,
	right = 1,
	down = width,
	left= 0,
	current = 0,
	listOfObstacles = document.getElementById("obstacleList").value,
	listOfObstacles = listOfObstacles.substring(0, listOfObstacles.length - 1),
	arrayOfObstacles = listOfObstacles.split(","),
	lengthOfObstacles = arrayOfObstacles.length,
	lowestFreeSpace = 0;

	if(index < 4){
		xOrigin = index * 300;
		yOrigin = 750;
		xCoord = xOrigin;
		yCoord = yOrigin;
		xyDelta = 14;
	}
	else if(index == 4){
		xOrigin = 3;
		yOrigin = 500;
		xCoord = xOrigin;
		yCoord = yOrigin;
		xyDelta = 10;
	}
		
	
	
for (var i = 0 ; i < length; i ++){
	for(var j = 0; j < width; j++){
		
		if(length == 1 && j == 0){
			this.createVertex(xCoord,yCoord, [right] , current);
		}

		else if(length == 1 && j == width - 1){
			this.createVertex(xCoord,yCoord, [left] , current);
		}
		
		else if(length == 1){
			this.createVertex(xCoord,yCoord, [left , right] , current);
		}
		
		else if(width == 1 && i == 0){
			this.createVertex(xCoord,yCoord, [right] , current);
		}
		
		else if(width == 1 && i == length - 1){
			this.createVertex(xCoord,yCoord, [left] , current);
		}
		
		else if(width == 1){
			this.createVertex(xCoord,yCoord, [left , right] , current);
		}
		
		else if(i == 0 && j == 0){
			this.createVertex(xCoord,yCoord, [right, down] , current);
		}
		else if(i == 0 && j == width-1){
			this.createVertex(xCoord,yCoord, [left, down] , current);
		}
		else if(i == length-1 && j == 0){
			this.createVertex(xCoord,yCoord, [up, right] , current);
		}
		else if(i == length-1 && j == width-1){
			this.createVertex(xCoord,yCoord, [up, left] , current);
		}
		else if(i == 0){
			this.createVertex(xCoord,yCoord, [left, right, down] , current);
		}
		else if(i == length - 1 ){
			this.createVertex(xCoord,yCoord, [ up, left, right] , current);
		}
		else if(j == 0){
			this.createVertex(xCoord,yCoord, [up, right, down] , current);
		}
		else if( j == width - 1 ){
			this.createVertex(xCoord,yCoord, [up, left, down] , current);
		}
		else{
			this.createVertex(xCoord,yCoord, [up, left, right, down] , current);
		}
		this.vertices[current].isObstacle = false;
		if(document.getElementById("obstacle").checked){
			for(var k = 0 ; k <lengthOfObstacles; k++){
				if(current == arrayOfObstacles[k] && arrayOfObstacles[k] !== ""){
					this.vertices[current].colorAsObstacle();
				}
			}
		}
		
		xCoord += xyDelta;
		current +=1;
		left = current - 1 ;
		right = current + 1;
		up = current - width;
		down = current - (-width);
	}
	xCoord = xOrigin;
	yCoord += xyDelta;
}
this.width = width;
this.length = length;
}

/**
 * Creates and draws a Vertex on the page
 * @method Graph.createVertex
 * @param {number} locationX X coordinate in pixels for vertex
 * @param {number} locationY Y coordinate in pixels for vertex
 * @param {Agent[]} neighbors Array containing the indices of the adjacent vertices
 * @param {string} name A string containing a unique name to easily identify a vertex by
 */
Graph.prototype.createVertex = function (locationX, locationY, neighbors, name) {
   this.constructVertex(locationX, locationY, neighbors, name, true);
};

/**
 * Creates and adds it to this.vertices without drawing it on the page.
 * @method Graph.addVertex
 * @param {number} locationX x coordinate in pixels for vertex
 * @param {number} locationY y coordinate in pixels for vertex
 * @param {Agent[]} neighbors array containing the indices of the adjacen vertices
 * @param {string} name a string containing a unique name to easily identify a vertex by
 */
Graph.prototype.addVertex = function (locationX, locationY, neighbors) {
    this.constructVertex(locationX, locationY, neighbors, null, false);
}

/**
 * Returns the edge related to the names given
 * @method Graph.getEdgeByNames
 * @param {string} startName Name of the starting vertex of the connection
 * @param {string} endName Name of the ending vertex of the connection
 * @returns {edge} Returns the edge related to the names given
 */
Graph.prototype.getEdgeByNames = function (startName, endName) {
	var edgesLength = this.edges.length,
		verticesLength = this.vertices.length,
		startIndex,
		endIndex;

	for (var j = 0; j < verticesLength; j ++ ) {
		if (this.vertices[j].name == startName) {
			startIndex = this.vertices[j].index;
		} else if (this.vertices[j].name == endName) {
			endIndex = this.vertices[j].index;
		}
	}
	
	for (var i = 0; i < edgesLength; i++ ){
		currentEdgeInfo = this.edges[i].edgeInfo();
		if (((startIndex == currentEdgeInfo[0]) && (endIndex == currentEdgeInfo[1])) || ((endIndex == currentEdgeInfo[0]) && (startIndex == currentEdgeInfo[1]))) {
			return this.edges[i];
		} 
	}
	return null;
}

/**
 * Returns the edge related to the values given
 * @method Graph.getEdgeByIndex
 * @param {number} startIndex Name of the starting vertex of the connection
 * @param {number} endIndex Name of the ending vertex of the connection
 * @returns {edge} Returns the edge related to the values given
 */
Graph.prototype.getEdgeByIndex = function (startIndex, endIndex){
	var edgesLength = this.edges.length;
	
	for ( var i = 0; i < edgesLength; i++ ){
		currentEdgeInfo = this.edges[i].edgeInfo();
		if (((startIndex == currentEdgeInfo[0]) && (endIndex == currentEdgeInfo[1])) || ((endIndex == currentEdgeInfo[0]) && (startIndex == currentEdgeInfo[1]))) {
			return this.edges[i];
		} 
	}
	return null;
}

/**
 * Helper method for constructing a Vertex
 * @method Graph.constructVertex
 * @param {number} locationX Location of vertex with respect to the x-axis
 * @param {number} locationY Location of vertex with respect to the Y-axis
 * @param {number[]} neighbors Array with value of the neighbors for the vertex
 * @param {string} name Title to be given to the vertex
 * @param {boolean} draw Indicates whether this vertex should be drawn or not.
 * @returns {vertex} The vertex that was created by this function
 */
Graph.prototype.constructVertex = function (locationX, locationY, neighbors, name, draw) {
    var vertexHtmlId = this.htmlContainer.substring(1) + "vertex" + this.vertexIndex,
        createdVertex =  new Vertex(neighbors, vertexHtmlId, this.vertexIndex, name);

    createdVertex.x = locationX;
    createdVertex.y = locationY;
    if (draw) {
        this.drawVertex(createdVertex);
    }
    this.vertices.push(createdVertex);
    this.vertexIndex++;
    return createdVertex;
}

/**
 * Draws the given vertex in this graph's htmlContainer based on its x and y properties.
 * @method Graph.drawVertex
 * @param {vertex} vertex Vertex that will be drawn due to this function
 */
Graph.prototype.drawVertex = function (vertex) {
    var vertexDiv = "<div class=\"vertex\" id=\"" + vertex.id.substring(1) + "\"></div>";
    $(this.htmlContainer).append($(vertexDiv));
    $(vertex.id).attr("name", vertex.name);
    setPositionInDocument(vertex.id, vertex.x, vertex.y);
}

/**
 * Creates an edge element on the page given two vertices.
 * @method Graph.createEdge
 * @param vertexStart A vertex object from where this edge should start
 * @param vertexEnd A vertex object where this edge ends
 */
Graph.prototype.createEdge = function (vertexStart, vertexEnd) {
    var vertexHolder,
        edgeHtmlId,
        edgeDiv,
        createdEdge;
 
    // vertexStart should have lower index for when the edge is drawn.
    if (vertexStart.index > vertexEnd.index) {
        vertexHolder = vertexStart;
        vertexStart = vertexEnd;
        vertexEnd = vertexHolder
    }
    
    edgeHtmlId = createEdgeIdFromVertices(this.htmlContainer, vertexStart, vertexEnd);
    edgeDiv = "<div class=\"edge\" id=\"" + edgeHtmlId + "\"></div>";
    createdEdge = new Edge(vertexStart, vertexEnd, edgeHtmlId);
    $(this.htmlContainer).append($(edgeDiv));
    this.verticesToEdge[vertexStart.index + "-" + vertexEnd.index] = this.edgeIndex;
    createdEdge.setPosition();
    createdEdge.value = 10;
    this.edges.push(createdEdge);
    this.edgeIndex++;
};

/**
 * Function that draws all the edges on the page.
 * @method Graph.initializeEdges
 */
Graph.prototype.initializeEdges = function () {
    var currentVertex,
        neighbors;

    for (var i = 0; i < this.vertices.length; i++) {
        currentVertex = this.vertices[i];
        neighbors = currentVertex.neighbors;
        for (var j = 0; j < neighbors.length; j++) {
            if (!this.hasEdgeBeenMade(currentVertex, this.vertices[neighbors[j]])) {
                this.createEdge(currentVertex, this.vertices[neighbors[j]]);
            }
        }
    }   
}

/**
 * Helper function to check if an edge has already been drawn between two vertices.
 * @method Graph.hasEdgeBeenMade
 * @param {vertex} vertexStart Vertex where the edge starts
 * @param {vertex} vertexEnd Vertex where the edge ends
 * @returns {boolean} States whether the edge has been made or not
 */
Graph.prototype.hasEdgeBeenMade = function (vertexStart, vertexEnd) {
    var vertexHolder,
        edgeId,
        edgeId2;

    edgeId = "#" + createEdgeIdFromVertices(this.htmlContainer, vertexStart, vertexEnd);
    edgeId2 = "#" + createEdgeIdFromVertices(this.htmlContainer, vertexEnd, vertexStart);
    if (($(edgeId).length + $(edgeId2).length) > 0) {
        return true;
    }
    return false;
}

/**
 * Helper function which will return the value of the edge related to the provided vertices
 * @method Graph.returnEdge
 * @param {vertex} vertexStart Vertex where the edge starts
 * @param {vertex} vertexEnd Vertex where the edge ends
 * @returns {number} Value of the edge related to the provided vertices
 */
Graph.prototype.returnEdge = function (vertexStart, vertexEnd) {
    var vertexHolder,
        edgeId,
        edgeId2;

    edgeId = "#" + createEdgeIdFromVertices(this.htmlContainer, vertexStart, vertexEnd);
    edgeId2 = "#" + createEdgeIdFromVertices(this.htmlContainer, vertexEnd, vertexStart);
    for(var i = 0; i < this.edges.length ; i++){
    	if(edgeId == this.edges[i].id || edgeId2 == this.edges[i].id){
    		return this.edges[i].value
    	}
    }
    return 10;
}

/**
 * Sets a value for an edge given its to terminal vertices.
 * @method Graph.setEdgeValue
 * @param {vertex} vertexStart a vertex's index that is the starting point for this edge.
 * @param {vertex} vertexEnd a vertex's index that is the ending point for this edge.
 * @param {number} value the value to assign this edge. 
 */
Graph.prototype.setEdgeValue = function (vertexStart, vertexEnd, value) {
    // keys for verticesToEdge always have the lower vertex index first. 
    var edgeKey = vertexStart < vertexEnd ? vertexStart + "-" + vertexEnd : vertexEnd + "-" + vertexStart,
        edgeIndex = this.verticesToEdge[edgeKey];
    if (edgeIndex !== undefined) {
        this.edges[edgeIndex].value = value;
    }
}

/**
 * Sets the heuristic value for the vertices in this graph, which for now is
 * just the straight line distance from each vertex to the goal vertex.
 * @method Graph.setHeuristicValuesForVertices
 */
Graph.prototype.setHeuristicValuesForVertices = function () {
    // For this application, the heuristic value will be
    // the distance in pixels to the goal vertex.
    var goalVertex = this.vertices[this.goal];

    for (i = 0; i < this.vertices.length; i++) {
        this.vertices[i].setValue(goalVertex);
    }
}

/**
 * Displays vertex values on the page as a <div> element.
 * @method Graph.displayVertexValues
 */
Graph.prototype.displayVertexValues = function () {
    var newDiv,
        valueDivId,
        xPos,
        yPos;
    for (var i = 0; i < this.vertices.length; i++) {
        if (this.vertices[i].value) {
            valueDivId = this.vertices[i].id + "valueDisplay",
            newDiv = "<div class=\'valueDisplay\' id=\'" + valueDivId.substr(1) + "\'></div>",
            xPos = this.vertices[i].x+12,
            yPos = this.vertices[i].y+30;
            $(this.htmlContainer).append(newDiv);
            $(valueDivId).html(this.vertices[i].value/10);
            setPositionInDocument(valueDivId, xPos, yPos);
        }
    }
}

/**
 * Displays vertex names on the page as a <div> element.
 * @method Graph.displayVertexNames
 */
Graph.prototype.displayVertexNames = function () {
    var newDiv,
        valueDivId,
        xPos,
        yPos;
    for (var i = 0; i < this.vertices.length; i++) {
        if (this.vertices[i].name) {
            nameDivId = this.vertices[i].id + "nameDisplay",
            newDiv = "<div class=\'nameDisplay\' id=\'" + nameDivId.substr(1) + "\'></div>",
            xPos = this.vertices[i].x+4,
            yPos = this.vertices[i].y+15;
            $(this.htmlContainer).append(newDiv);
            $(nameDivId).html(this.vertices[i].name);
            setPositionInDocument(nameDivId, xPos, yPos);
        }
    }
}

/**
 * Removes all vertex value <div> elements from the htmlContainer for this graph.
 * @method Graph.hideVertexValues
 */
Graph.prototype.hideVertexValues = function () {
    $(this.htmlContainer + " > .valueDisplay").remove();
}

/**
 * Displays edge values as a <div> element on the page.
 * @method Graph.displayEdgeValues
 */
Graph.prototype.displayEdgeValues = function () {
    for (var i = 0; i < this.edges.length; i++) {
        this.edges[i].displayValue();
    }
}

/**
 * Removes all edge value <div> elements from the htmlContainer for this graph.
 * @method Graph.hideEdgeValues
 */
Graph.prototype.hideEdgeValues = function () {
    $(this.htmlContainer + " > .edgeValue").remove();
}

/**
 * Allows for hovering over a Vertex to display its name.
 * @method Graph.enableVertexHoverText
 */
Graph.prototype.enableVertexHoverText = function () {
    var htmlContainer = this.htmlContainer;
    $(htmlContainer + " > .vertex").hover(
        function () {
            var x = parseFloat($(this).css("left")),
                y = parseFloat($(this).css("top")),
                vertexDiameter = parseFloat($(".vertex").css("width")),
                popupId = this.id + "popUp",
                newDiv = "<div class=\'vertexPopup\' id=\'" + popupId + "\'></div>";
            $(htmlContainer).append(newDiv);
            $("#" + popupId).css({
                "left": (x + vertexDiameter + 10) + "px",
                "top" : y + "px"
            });
            $("#" + popupId).html($(this).attr("name"));
        },
        function () {
            $(htmlContainer + "> .vertexPopup").remove();
        }
    );
}

/**
 * Function that allows for user to click on graph to add a value to the vertex
 * @method Graph.enableColorClick
 * @param {graph} graphData Graph that will have value incremented and vertex colored when clicked
 */
Graph.prototype.enableColorClick= function (graphData) {
    var htmlContainer = this.htmlContainer;
    $(htmlContainer + " > .vertex").click(
        function () {
        	var tileToValue = this.id.substr(9);
        	graphData.valueTiles += graphData.vertices[tileToValue].colorAsValue();
        }
    );
}

/**
 * Function that allows user to remove obstacle from graph by double clicking the obstacle.
 * @method Graph.enableObstacleRemoval
 * @param {graph} graphData Graph that will have value incremented and vertex colored when clicked
 */
Graph.prototype.enableObstacleRemoval= function (graphData) {
    var htmlContainer = this.htmlContainer;
    $(htmlContainer + " > .vertex").dblclick(
        function () {
        	var tileToValue = this.id.substr(9),
        		listOfObstacles = document.getElementById("obstacleList").value,
        		listOfObstacles = listOfObstacles.substring(0, listOfObstacles.length ),
        		arrayOfObstacles = listOfObstacles.split(","),
        		arrayOfObstacles1stPart,
        		arrayOfObstacles2ndPart,
        		length = arrayOfObstacles.length,
        		index = -1;
        	for(var i = 0 ; i < length ; i++){
        		if(tileToValue == arrayOfObstacles[i]){
        			index = i;
        		}
        	}
        	if(arrayOfObstacles[0] == "" && length > 1){
        		arrayOfObstacles1stPart = arrayOfObstacles.slice(1,index);
        	}
        	else{
        		arrayOfObstacles1stPart = arrayOfObstacles.slice(0,index);
        	}
        	
        	arrayOfObstacles2ndPart = arrayOfObstacles.slice(index + 1);
        	
        	if(arrayOfObstacles1stPart == 0){
        		arrayOfObstacles = arrayOfObstacles2ndPart;
        	}
        	else if(arrayOfObstacles2ndPart == 0){
        		arrayOfObstacles = arrayOfObstacles1stPart + ",";
        	}
        	else{
        		arrayOfObstacles = arrayOfObstacles1stPart + "," + arrayOfObstacles2ndPart;
        	}
        	if(document.getElementById("obstacle").checked && index !== -1){
        		graphData.vertices[tileToValue].colorAsNormal();
        		document.getElementById("obstacleList").value = arrayOfObstacles;
        	}
        	arrayOfObstacles = [];
        }
    );
}

/**
 * Function that allows user to right click in order to decrease the value of the vertex
 * @method Graph.enableCleanClick
 * @param {graph} graphData Graph that will have value incremented and vertex colored when clicked
 */
Graph.prototype.enableCleanClick= function (graphData) {
    var htmlContainer = this.htmlContainer;
    $(htmlContainer + " > .vertex").contextmenu(
        function () {
        	var arrayList = document.getElementById("obstacleList").value;
        	event.preventDefault();
            event.stopPropagation();
        	var tileToValue = this.id.substr(9),
        		valueChange = graphData.vertices[tileToValue].colorDecrease();
        	if(valueChange == 0 && document.getElementById("obstacle").checked && !graphData.vertices[tileToValue].isObstacle){
        		graphData.vertices[tileToValue].colorAsObstacle();
        		document.getElementById("obstacleList").value = arrayList + tileToValue + ",";
        	}
        	else{
        		graphData.valueTiles += valueChange;
        	}
        }
    );
}

/**
 * Sets an HTML Element in the desired location
 * @method Graph#setPositionInDocument
 * @param {HtmlElement} elementId HTML Element that will be moved
 * @param {number} positionX Position to move HTML Element to with respect to the x-axis
 * @param {number} positionY Position to move HTML Element to with respect to the y-axis
 */
var setPositionInDocument = function (elementId, positionX, positionY) {
    $(elementId).css({
        "left": positionX + "px",
        "top" : positionY + "px"
    });
}

/**
 * creates Html ID for the edges
 * @method Graph#createEdgeIdFromVertices
 * @param {HtmlElement} container Html Element that will contain this Html ID
 * @param {vertex} vertexStart Vertex where the edge starts
 * @param {vertex} vertexEnd Vertex where the edge ends
 */
var createEdgeIdFromVertices = function (container, vertexStart, vertexEnd) {
    return container.substring(1) + "edge" + vertexStart.index + "-" + vertexEnd.index;
}
