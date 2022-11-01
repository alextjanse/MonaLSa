import { Shape2D } from './shape.js';
import {
    Point,
    LineSegment,
    isPointInRectangle,
    lineSegmentRectangleIntersection,
    createPointCloudBoundingBox,
} from '../math.js';

/**
 * Triangle class
 * @property {Point} p1 Point 1
 * @property {Point} p2 Point 2
 * @property {Point} p3 Point 3
 * @property {Point[]} points List of points
 * @property {LineSegment} l12 (p1, p2)
 * @property {LineSegment} l23 (p2, p3)
 * @property {LineSegment} l13 (p3, p1)
 * @property {LineSegment[]} sides List of sides
 */
class Triangle extends Shape2D {
    /**
     * Create a Triangle object
     * @param {Point} p1 Point 1
     * @param {Point} p2 Point 2
     * @param {Point} p3 Point 3
     */
    constructor(p1, p2, p3) {
        super();

        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.points = [p1, p2, p3];

        const l12 = new LineSegment(p1, p2);
        const l23 = new LineSegment(p2, p3);
        const l13 = new LineSegment(p1, p3);

        this.l12 = l12;
        this.l23 = l23;
        this.l13 = l13;

        this.sides = [l12, l23, l13];
    }

    /**
     * Create the intersection box of the canvas and the triangle.
     * @param {BoundingBox} canvasBoundingBox 
     * @return {BoundingBox}
     */
    canvasIntersection(canvasBoundingBox) {
        const { points, sides } = this;
        /*
        Calculate the bounding box of the intersection between the canvas
        and the triangle. Do this by keeping track of all x and y values
        of the points in the canvas and the intersection points of the triangle
        with the canvas borders. Then, get the maximum and minimum x and y values.
        */

        const extremePoints = [];
        
        // Add all point that are in the canvas to the extreme points
        points.forEach(p => {
            if (isPointInRectangle(p, canvasBoundingBox)) {
                extremePoints.push(p);
            }
        });

        // Add all canvas intersections to the extreme point
        sides.forEach(l => extremePoints.push(...lineSegmentRectangleIntersection(l, canvasBoundingBox)));

        return createPointCloudBoundingBox(extremePoints);
    }

    area() {
        const {
            p1: { x: x1, y: y1 },
            p2: { x: x2, y: y2 },
            p3: { x: x3, y: y3 },
        } = this;

        return 0.5 * Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
    }

    /**
     * Draw the triangle on the given canvas in the given color.
     * @param {Canvas} canvas The canvas to be drawn on.
     * @param {Color} color The color to be drawn in.
     */
    draw(canvas, color) {
        const { p1, p2, p3 } = this;

        canvas.fillPath([p1, p2, p3], color);
    }

    equals(other) {
        const { p1, p2, p3 } = this;
        const { p1: q1, p2: q2, p3: q3 } = other;

        return p1.equals(q1) && p2.equals(q2) && p3.equals(q3);
    }
}

export default Triangle;