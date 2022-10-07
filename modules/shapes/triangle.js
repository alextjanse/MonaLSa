import { Shape2D } from './shape.js';
import { Point, LineSegment } from '../math.js';

/**
 * Triangle class
 * @property {Point} p1 Point 1
 * @property {Point} p2 Point 2
 * @property {Point} p3 Point 3
 * @property {LineSegment} l1 (p1, p2)
 * @property {LineSegment} l2 (p2, p3)
 * @property {LineSegment} l3 (p3, p1)
 */
 class Triangle extends Shape2D {
    constructor(p1, p2, p3) {
        super();
        
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;

        this.l1 = new LineSegment(p1, p2);
        this.l2 = new LineSegment(p2, p3);
        this.l3 = new LineSegment(p3, p1);
    }

    area() {
        
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
        const { p1: q1, p2: q2, p3: q4 } = other;

        return p1.equals(q1) && p2.equals(q2) && p3.equals(q3);
    }
}

export default Triangle;