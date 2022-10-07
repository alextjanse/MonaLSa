import { Shape1D } from './shape.js';
import { Point } from '../math.js';

/**
 * Line segment object
 * @param {Point} p endpoint 1
 * @param {Point} q endpoint 2
 */
 class LineSegment extends Shape1D {
    constructor(p, q) {
        super();
        
        this.p = p;
        this.q = q;
    }

    length() {
        const { p: { x: x1, y: y1 }, q: { x: x2, y: y2 } } = this;

        Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    }

    equals(other) {
        const { p: p1, q: q1 } = this;
        const { p: p2, q: q2 } = other;

        return p1.equals(p2) && q1.equals(q2);
    }
}

export default LineSegment;