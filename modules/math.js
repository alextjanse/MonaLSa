import { randomInRange } from './operators.js';

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

function getRandomPoint(xlb, xub, ylb, yub) {
    const x = randomInRange(xlb, xub);
    const y = randomInRange(ylb, yub);

    return new Point(x, y);
}

/**
 * Line segment object
 * @param {Point} p endpoint 1
 * @param {Point} q endpoint 2
 */
function LineSegment(p, q) {
    this.p = p;
    this.q = q;
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

    this.l1 = new LineSegment(p1, p2);
    this.l2 = new LineSegment(p2, p3);
    this.l3 = new LineSegment(p3, p1);

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

    this.topLeft = new Point(x0, y0);
    this.topRight = new Point(x0 + w, y0);
    this.bottomLeft = new Point(x0, y0 + h);
    this.bottomRight = new Point(x0 + w, y0 + h);

    this.top = new LineSegment(this.topLeft, this.topRight);
    this.bottom = new LineSegment(this.bottomLeft, this.bottomRight);
    this.left = new LineSegment(this.topLeft, this.bottomLeft);
    this.right = new LineSegment(this.topRight, this.bottomRight);
}

/**
 * Get the intersection point of two line segments.
 * @param {LineSegment} l line segment 1
 * @param {LineSegment} k line segment 2
 * @return {Point | null} if there is no intersection, return null.
 */
 function getIntersectionLineSegments(l, k) {
    const { p: { x: x1, y: y1 }, q: { x: x2, y: y2 } } = l;
    const { p: { x: x3, y: y3 }, q: { x: x4, y: y4 } } = k;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    const u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

    if ((0 <= t) && (t <= 1) && (0 <= u) && (u <= 1)) {
        const x = x1 + t * (x2 - x1);
        const y = y1 + t * (y2 - y1);

        return new Point(x, y);
    }

    return null;
}

/**
 * Get the intersection points of a line segment with a rectangle.
 * @param {LineSegment} l line segment
 * @param {Rectangle} b rectangle
 * @return {Point[]} array with intersection points
 */
 function lineSegmentRectangleIntersection(l, b) {
    const { top, bottom, left, right } = b;

    let output = [];

    output.push(getIntersectionLineSegments(l, top));
    output.push(getIntersectionLineSegments(l, bottom));
    output.push(getIntersectionLineSegments(l, left));
    output.push(getIntersectionLineSegments(l, right));

    return output.filter(x => x != null);
}

/**
 * Get the bounding box of the intersection between a rectangle and a triangle.
 * @param {Triangle} t
 * @param {Rectangle} b
 * @return {Rectangle}
 */
 function triangleBoundingBox(t, b) {
    const { p1, p2, p3, l1, l2, l3 } = t;
    const { x: x1, y: y1 } = p1;
    const { x: x2, y: y2 } = p2;
    const { x: x3, y: y3 } = p3;

    /*
    Calculate the bounding box of the intersection between the canvas
    and the triangle. Do this by keeping track of all x and y values
    of the points in the canvas and the intersection points of the triangle
    with the canvas borders. Then, get the maximum and minimum x and y values.
    */
    let xs = [x3];
    let ys = [y3];

    if (isPointInRectangle(p1, b)) {
        xs.push(x1);
        ys.push(y1);
    }

    if (isPointInRectangle(p2, b)) {
        xs.push(x2);
        ys.push(y2);
    }

    const intersections = [
        ...lineSegmentRectangleIntersection(l1, b),
        ...lineSegmentRectangleIntersection(l2, b),
        ...lineSegmentRectangleIntersection(l3, b)
    ];

    intersections.forEach(p => {
        xs.push(p.x);
        ys.push(p.y);
    });

    const xmin = Math.floor(Math.min(...xs));
    const xmax = Math.ceil(Math.max(...xs));
    const ymin = Math.floor(Math.min(...ys));
    const ymax = Math.ceil(Math.max(...ys));

    return new Rectangle(xmin, ymin, xmax - xmin, ymax - ymin);
}

/**
 * Check if the given point is in a rectangle.
 * @param {Point} p point
 * @param {Rectangle} b rectangle
 */
 function isPointInRectangle(p, b) {
    const { x, y } = p;
    const { x0, y0, w, h } = b;

    return (x0 <= x) && (x <= x0 + w) && (y0 <= y) && (y <= y0 + h);
}

export { Point, LineSegment, Triangle, Rectangle, isPointInRectangle, getRandomPoint, triangleBoundingBox };