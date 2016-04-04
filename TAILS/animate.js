/**
 * animate.js
 * 
 * @file Causes the movement of of the HTML Elements that represent the agent to move 
 *
 * @author Eric Jaso
 * @version 1
 */

/**
 * @constructor Animate
 * @param {HtmlElement} newSprite This is the element that will be moved on the environment
 * @property {HTMLElement} sprite This is the element that will be moved on the environment
 * @property {number} animationSpeed States how fast the animation will run
 * @property {number} animationSteps Affects how fast the animation will run
 * @property {number} animationDuration States how long the animation will take
 */ 
var Animate = function (newSprite) {
        this.sprite = newSprite;
        this.animationSpeed = 1;
        this.animationSteps = 20;
        this.animationDuration = this.animationSpeed * this.animationSteps;
    },
    
    /**
     * moves the HtmlElement a certain distance
     * @method Animate#moveTo
     * @param {number} toLeft indicates where to move the HtmlElement to with respect to the left barrier 
     * @param {number} toTop indicates where to move the HtmlElement to with respect to the top barrier 
     */ 
    moveTo = function (toLeft, toTop) {
        $(this.sprite).css('left', toLeft + 'px');
        $(this.sprite).css('top', toTop + 'px');
        alert(this.sprite);
    },

    /**
     * Stops the animation
     * @method Animation#stopAnimation
     */
    stopAnimation = function (currentInterval) {
        if(currentInterval) {
            clearInterval(currentInterval);
        }
    },
    
    /**
     * @method Animate#getDifferenceOverDuration
     */
    getDifferenceOverDuration = function (minuend, subtrahend, divisor) {
        return (minuend - subtrahend) / divisor;
    };

    /**
     * Sets the animation speed
     * @method Animate.setSpeed
     * @param {number} speedInMs Speed of graph with value in milliseconds
     */
Animate.prototype.setSpeed = function (speedInMs) {
    this.animationSpeed = speedInMs;
    this.animationDuration = this.animationSpeed * this.animationSteps
};

/**
 * Where to animate HTML Element towards
 * @method Animate.animateTo
 * @param {number} toLeft Location of HTML with respect to left border
 * @param {number} toTop Location of HTML with respect to top border
 */
Animate.prototype.animateTo = function (toLeft, toTop) {
    $(this.sprite).animate({
        left: toLeft,
        top: toTop
    }, this.animationDuration, function() {
        // No callback needed.
    });
};
