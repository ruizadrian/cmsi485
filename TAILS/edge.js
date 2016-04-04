
/**
 * @constructor Edge
 * @param {vertex} vertexStart Vertex where edge starts
 * @param {vertex} vertexFinish Vertex where edge ends
 * @param {HTMLElement} htmlElement Division from the HTML code that will be used for visuals
 */
var Edge = function (vertexStart, vertexFinish, htmlElement) {
    this.vertices = [vertexStart, vertexFinish];
    this.id = "#" + htmlElement;
    this.value;
    this.xMidpoint;
    this.yMidpoint;
}

Edge.searchedColor = "#00AA00";
Edge.unsearchedColor = "#000000";
Edge.currentPathColor = "#5555EE";
Edge.finalColor = "#AA55AA";

Edge.prototype.colorAsFinal = function() {
	$(this.id).css("border-color", Edge.finalColor);
}

Edge.prototype.colorAsCurrentPath = function () {
    $(this.id).css("border-color", Edge.currentPathColor);
}

Edge.prototype.colorAsUnsearched = function () {
    $(this.id).css("border-color", Edge.unsearchedColor);
}

Edge.prototype.colorAsSearched = function () {
    $(this.id).css("border-color", Edge.searchedColor);
}

Edge.prototype.edgeInfo = function () {
	var namePath = [];
	namePath.push(this.vertices[0].index);
	namePath.push(this.vertices[1].index);
	return namePath;
}

Edge.prototype.setPosition = function () {
    var vertices = this.vertices,
        vertRadius = vertices[0].getRadius(),
        yPosition,
        xPosition,
        xDistance,
        yDistance;

    vertices.sort(function (a, b ){
        return a.index - b.index;
    });

    xDistance = vertices[1].x - vertices[0].x,
    yDistance = vertices[1].y - vertices[0].y;
    
    length = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    angle = Math.atan(yDistance / xDistance) * 180 / Math.PI;
    yPosition = vertices[0].y + (yDistance / 2) + vertRadius;
    xPosition = ((vertices[0].x + vertices[1].x) / 2) - (length / 2) + vertRadius;

    // Set edge midpoints;
    this.xMidpoint = vertices[0].x + xDistance / 2;
    this.yMidpoint = vertices[0].y + yDistance / 2;

    $(this.id).css({
        "width": length + "px",
        "-moz-transform":"rotate(" + angle + "deg)",
        "-webkit-transform": "rotate(" + angle + "deg)",
        "left": xPosition + "px",
        "top": yPosition + "px"
    });
}

Edge.prototype.displayValue = function () {
    if (this.value) {
        var valueDivId = this.id + "edgeValue",
            newDiv = "<div class=\'edgeValue\' id=\'" + valueDivId.substr(1) + "\'></div>",
            xPos = this.xMidpoint+8,
            yPos = this.yMidpoint+8;
        $(this.id).parent().append(newDiv);
        $(valueDivId).html(this.value/10);
        setPositionInDocument(valueDivId, xPos, yPos);
    }
}
