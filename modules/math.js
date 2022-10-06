/**
 * Point object
 * @constructor
 * @param {number} x 
 * @param {number} y 
 * @return {Point}
 */
function Point(x, y) {
    this.x = x;
    this.y = y;
}

/**
 * Triangle object
 * @constructor
 * @param {Point} p1 
 * @param {Point} p2 
 * @param {Point} p3 
 * @param {Point} c 
 * @return {Triangle} 
 */
function Triangle(p1, p2, p3, c) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.c = c;
}

/**
 * Rectangle object
 * @constructor
 * @param {number} x0 origin-x
 * @param {number} y0 origin-y
 * @param {number} w width
 * @param {number} h height
 * @return {Rectangle}
 */
function Rectangle(x0, y0, w, h) {
    this.x0 = x0;
    this.y0 = y0;
    this.w = w;
    this.h = h;
}

export { Point, Triangle, Rectangle };