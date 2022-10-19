import { randomInRange } from './utils.js';
import Point from './shapes/point.js';
import LineSegment from './shapes/lineSegment.js';
import Rectangle from './shapes/rectangle.js';
import Triangle from './shapes/triangle.js';
import Circle from './shapes/circle.js';
import BoundingBox from './boundingBox.js';

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

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) /
              ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    const u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) /
              ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

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
 * Create a bounding box of the given points.
 * @param {Point[]} points List of extreme points.
 * @return {BoundingBox} The bounding box
 */
 function createPointCloudBoundingBox(points) {
    if (points.length === 0) {
        return new BoundingBox(0, 0, 0, 0);
    }

    let xmin, xmax, ymin, ymax;

    points.forEach(({ x, y }) => {
        xmin = xmin === null ? x : Math.min(xmin, x);
        xmax = xmax === null ? x : Math.max(xmax, x);
        ymin = ymin === null ? y : Math.min(ymin, y);
        ymax = ymax === null ? y : Math.max(ymax, y);
    });

    return new BoundingBox(
        Math.floor(xmin), // x0
        Math.floor(ymin), // y0
        Math.ceil(xmax - xmin), // width
        Math.ceil(ymax - ymin), // height
    );
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

export { 
    Point,
    LineSegment,
    Triangle,
    Rectangle,
    Circle,
    isPointInRectangle,
    getRandomPoint,
    createPointCloudBoundingBox,
    lineSegmentRectangleIntersection,
};