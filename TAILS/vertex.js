/**
 * @author Eric Jaso
 * @version 4
 */

/*
 * Vertex is a helper class for class Graph.
 *
 * @author Eric Jaso
 * Constructor function for Vertex
 *
 * @param neighbors an array containing the indices of adjacent/connected vertices.
 * @param htmlId the HTML element's id that represents this vertex.
 * @param index The index according to the containing Graph.
 * @param name The name of this vertex
 * 
 *  Change History:
 * 6-28-2013 Miguel Vazquez  Added methods to color tiles based on their level
 * 7-29-2013 Miguel Vazquez  Changed functions that change tile appearance to change background image
 * 							 instead of color when the vertex's level has changed. Also changed colors
 * 							 used 
 * 7-30-2013 Miguel Vazquez  Changed variable names to be more generic so that if scenario 
 * 							 changes same variables can be used
 */

/**
 * @constructor Vertex
 * @param {number[]} neighbors array of the values related to the vertex
 * @param {string} htmlId string which can be used to get the ID of an HTML Element
 * @param {number} index The index of the vertex 
 * @param {string} name String that will be used as the name for the Vertex
 * @property {number[]} neighbors Array holding the index of the 
 * @property {string} id String which holds the HTML ID to make changes on the visuals
 * @property {string} name String which is the name for this Vertex
 * @property {number} index Index of vertex with respect to the graph
 * @property {number} x Number representing position of vertex with respect to x-axis
 * @property {number} y Number representing position of vertex with respect to y-axis
 * @property {number} valueLevel Value of the vertex
 * @property {boolean} isObstacle Boolean stating whether the Vertex is an obstacle or not.
 */
var Vertex = function (neighbors, htmlId, index, name) {
    this.neighbors = neighbors;
    this.id = "#" + htmlId;
    this.value;
    this.name = name;
    this.index = index;
    this.x;
    this.y;
    this.valueLevel = 0;
    this.isObstacle = false;
};

// The colors for each stage of a vertex are set here.
Vertex.cleanColor = "#FFFFFF";
Vertex.value1Color = "#C7B39A";
Vertex.value2Color = "#736356";
Vertex.value3Color = "#764C24";
Vertex.value4Color = "#B0510D";
Vertex.obstacleColor = "#A60000";
Vertex.borderColor = "#000000";

/**
 * Adds another neighbor to this vertex. Neighbors should
 * be unique.
 * @method Vertex.addNeighbor
 * @param newNeighbor the new neighboring vertex's index.
 */
Vertex.prototype.addNeighbor = function (newNeighbor) {
    this.neighbors.push(newNeighbor);
}

Vertex.prototype.colorAsFinal = function() {
	$(this.id).css("border-color", Vertex.finalColor);
}

/**
 * Changes the background image of a vertex so that is looks like an obstacle
 * @method Vertex.colorAsObstacle
 */
Vertex.prototype.colorAsObstacle = function(){
	$(this.id).css("background-image", 'url(obstacleLayerBug.jpg)');
	this.valueLevel = -1;
	this.isObstacle = true;
}

/**
 * Colors this Vertex according to Vertex.searchedColor
 * @method Vertex.colorAsBorder
 */
Vertex.prototype.colorAsBorder = function () {
    $(this.id).css("border-color", Vertex.borderColor);
}

/**
 * Changes the background image of a vertex so that is looks like it has no value
 * @method Vertex.colorAsNormal
 */
Vertex.prototype.colorAsNormal = function () {
	
	if (this.valueLevel == -1){
		$(this.id).css("background-image", 'url(0LayerBug.jpg)');
		this.valueLevel = 0;
		this.isObstacle = false;
	}

}

/**
 * changes the background image of a vertex and increases its value depending on the value it has
 * @method Vertex.colorAsValue
 * @returns {number} Number indicates the change in value of the vertex
 */
Vertex.prototype.colorAsValue = function () {
	
	if (this.valueLevel == 0){
		$(this.id).css("background-image", 'url(1LayerBug.jpg)');
		this.valueLevel = 1;
		return 1;
	}
	
	else if (this.valueLevel == 1){
		$(this.id).css("background-image", "url(2LayerBug.jpg)");
		this.valueLevel = 2;
		return 1;
	}
	
	else if (this.valueLevel == 2){
		$(this.id).css("background-image", "url(3LayerBug.jpg)");
		this.valueLevel = 3;
		return 1;
	}
	return 0;
}

/**
 * changes the background image of a vertex and decreases its value depending on the value it has
 * @method Vertex.colorDecrease
 * @returns {number} Number indicates the change in value of the vertex
 */
Vertex.prototype.colorDecrease = function () {
	if (this.valueLevel == 1){
		$(this.id).css("background-image", "url(0LayerBug.jpg)");
		this.valueLevel = 0;
		return -1;
	}
	
	else if (this.valueLevel == 2){
		$(this.id).css("background-image", "url(1LayerBug.jpg)");
		this.valueLevel = 1;
		return -1;
	}
	
	else if (this.valueLevel == 3){
		$(this.id).css("background-image", "url(2LayerBug.jpg)");
		this.valueLevel = 2;
		return -1;
	}
	else if (this.valueLevel == 4){
		$(this.id).css("background-image", "url(3LayerBug.jpg)");
		this.valueLevel = 3;
		return -1;
	}
	return 0;
}

/**
 * Either calls upon the colorAsValue method or changes the background image and value of the vertex 
 * @method Vertex.childrenAtPlay
 * @returns {number} Number indicates the change in value of the vertex
 */
Vertex.prototype.childrenAtPlay = function () {
	if(this.valueLevel < 3 && this.valueLevel >= 0){
		return this.colorAsValue();
	}
	else if(this.valueLevel == 3){
		$(this.id).css("background-image", "url(4LayerBug.jpg)");
		this.valueLevel += 1;
		return 1;
	}
	return 0;
}

/**
 * Colors this Vertex according to Vertex.openColor.
 * @method Vertex.colorAsCurentPath
 */
Vertex.prototype.colorAsCurrentPath = function () {
    $(this.id).css("border-color", Vertex.openColor);
}

/**
 * Returns the radius of this Vertex.
 * @method Vertex.getRadius
 * @returns {number} Number indicates the radius of the vertex
 */
Vertex.prototype.getRadius = function () {
    var diameter = parseFloat($(".vertex").css("width").replace("px", ""));
        
    return (diameter / 2);
}

/**
 * Sets a heuristic value for this Vertex. The currently only used heuristic value
 * for this program is straight line distance from this Vertex to the goal Vertex.
 * @method Vertex.setValue
 * @param goalVertex a Vertex object that is destination for the containing graph.
 */
Vertex.prototype.setValue = function (goalVertex) {
    if (this.x == goalVertex.x && this.y == goalVertex.y){
    	this.value = 0;
    }
    var dx = Math.abs(this.x - goalVertex.x),
        dy = Math.abs(this.y - goalVertex.y),
        delta = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        
    this.value = Math.floor(delta);
}

/**
 * Sets the color of a vertex with respect to the value given
 * @method Vertex.setColor
 * @param {number} valueLevel value of the vertex that is having its color changed
 * @returns {number} Number indicates the change in value of the vertex
 */
Vertex.prototype.setColor = function (valueLevel) {
	var currentValue = this.valueLevel,
		value;
	$(this.id).css("opacity", 1);
	if(valueLevel == -1){
		$(this.id).css("background-color", Vertex.obstacleColor);
		this.valueLevel = -1;
		value = -1;
	}
	else if(valueLevel == 0){
		$(this.id).css("background-color", Vertex.cleanColor);
		this.valueLevel = 0;
		value = 0;
	}
	else if(valueLevel == 1){
		$(this.id).css("background-color", Vertex.value1Color);
		this.valueLevel = 1;
		value = 1;
	}
	else if(valueLevel == 2){
		$(this.id).css("background-color", Vertex.value2Color);
		this.valueLevel = 2;
		value = 2;
	}
	else if(valueLevel == 3){
		$(this.id).css("background-color", Vertex.value3Color);
		this.valueLevel = 3;
		value = 3;
	}
	else if(valueLevel == 4){
		$(this.id).css("background-color", Vertex.value4Color);
		this.valueLevel = 4;
		value = 4;
	}
	if(currentValue == -1 && value !== -1){
		return value;
	}
	return value - currentValue;
}