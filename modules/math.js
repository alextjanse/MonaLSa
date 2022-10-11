import { randomInRange } from './utils.js';
import Point from './shapes/point.js';
import LineSegment from './shapes/lineSegment.js';
import Rectangle from './shapes/rectangle.js';
import Triangle from './shapes/triangle.js';

function getRandomPoint(xlb, xub, ylb, yub) {
    const x = randomInRange(xlb, xub);
    const y = randomInRange(ylb, yub);

    return new Point(x, y);
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
 * @return {Rectangle | null} Return null if the triangle falls outside the rectangle.
 */
 function triangleBoundingBox(t, b) {
    const { p1, p2, p3, l1, l2, l3 } = t;

    /*
    Calculate the bounding box of the intersection between the canvas
    and the triangle. Do this by keeping track of all x and y values
    of the points in the canvas and the intersection points of the triangle
    with the canvas borders. Then, get the maximum and minimum x and y values.
     */

    let xs = [];
    let ys = [];
   
    [p1, p2, p3].forEach(p => {
        if (isPointInRectangle(p, b)) {
            const { x, y } = p;
            xs.push(x);
            ys.push(y);
        }
    });

    [l1, l2, l3].forEach(l => {
        lineSegmentRectangleIntersection(l, b).forEach(({ x, y }) => {
            xs.push(x);
            ys.push(y);
        });
    });

    if (xs.length === 0) {
        // All points are outside the rectangle
        return null;
    }

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
    const { x0, y0, width, height } = b;

    return (x0 <= x) && (x <= x0 + width) && (y0 <= y) && (y <= y0 + height);
}

export { Point, LineSegment, Triangle, Rectangle, isPointInRectangle, getRandomPoint, triangleBoundingBox };