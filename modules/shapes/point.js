import { Shape1D } from './shape.js';

class Point extends Shape1D {
    constructor(x, y) {
        super();
        
        this.x = x;
        this.y = y;
    }

    equals(other) {
        const { x: x1, y: y1 } = this;
        const { x: x2, y: y2 } = other;

        return x1 === x2 && y1 === y2;
    }
}

export default Point;