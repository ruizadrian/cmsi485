

/** minigraph.js

 * 

 * @file Object intended to be used by agent to create a smaller version of the environment as a reference for traversal

 *

 * @author Miguel Vazquez

 *

 * @version 3

*/



/* minigraph.js

 * 

 * Description:  Object intended to be used by agent to create a smaller version of the environment as a reference for traversal

 *

 * Created by:  @author Miguel Vazquez     Date:  7-1-2013

 *

 * Change History:

 * 7-1-2013  Miguel Vazquez  .Initial version.

 * 7-22-2013 Miguel Vazquez  Changed minigraph to use createEntireGraph function and changed updateMiniMap accordingly

 * 7-30-2013 Miguel Vazquez  Changed variable names and file name to be more generic so that if scenario 

 *                           changes same variables can be used

 **********************************************************************

*/



/**

 * @constructor MiniGraph

 * @param {number} agentNumber Index of the agent with respect to the other agents

 * @property {string} string Holds HTML ID of this object

 * @property {graph} graph Graph related to this MiniGraph

 * @property {number} width Width of the graph

 * @property {number} length Length of the graph

 * @property {number} agentIndex What number agent this MiniGraph belong to

 */



var MiniGraph = function (graphData, agentNumber) {

    var string = "#miniMap" + agentNumber;

    this.graph = new Graph(string);

    this.graph.createEntireGraph(agentNumber);

    this.width = $('#width option:selected').val();

    this.length = $('#length option:selected').val();

    this.agentIndex = agentNumber;

    this.graph.width = this.width;

    this.graph.length = this.length;

};



/**

 * Function that will update the minimap with the new information given by the agent

 * @method MiniGraph.updateMiniMap

 * @param {vertex} currentLocation Vertex the agent is currently located on

 * @param {number[]} neighboringValueInfo Array containing the value of the currentLocation's neighbors

 */

MiniGraph.prototype.updateMiniMap = function (currentNode, neighboringValueInfo){

    var agentNumber = this.agentIndex,

        graph = this.graph,

        vertices = graph.vertices,

        width = this.width,

        length = this.length,

        value = currentNode.index,

        numberOfVertices = vertices.length,

        neighbors = currentNode.neighbors,

        numberOfNeighbors = neighbors.length;

    

    var neighbor;

    for(var j = 0 ; j < numberOfNeighbors; j++){

        var vertexNeighbor;

        value = neighbors[j];

        vertexNeighbor = graph.vertices[value];

        this.graph.valueTiles += vertexNeighbor.setColor(neighboringValueInfo[j]);

    }

    this.graph.valueTiles += vertices[currentNode.index].setColor(currentNode.valueLevel);

};