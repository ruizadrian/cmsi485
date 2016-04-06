
/** effectors.js
 * 
 * @file Object intended to be used by agent to act on the environment
 *
 * @author Miguel Vazquez
 * @version 3
*/

/* effectors.js
 * 
 * Description:  Object intended to be used by agent to act on the environment
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
 * @constructor Effectors
 */
var Effectors = function(){
};

/**
 * Function that will decrease the value of a vertex unless Murphy's Law succeeds
 * @method Effectors.decreaseValue
 * @param {vertex} currentLocation The vertex the agent is currently located on
 * @return {number} Will return the difference in value that the action has caused
 */
Effectors.prototype.decreaseValue = function(currentLocation){
	var murphyPercentage = document.getElementById("murphyLawValue").value;
	
	if(Math.random()*100 < murphyPercentage && document.getElementById("murphyLaw").checked){
		return currentLocation.colorAsValue();
	}
	
	else{
		return currentLocation.colorDecrease();
	}
	
}