import { Shape2D } from './shape.js';
import { Point, LineSegment } from '../math.js';
import { Color } from '../color.js';
import { Canvas } from '../canvas.js';
import BoundingBox from '../boundingBox.js';

/**
 * Class representing a rectangle.
 * @property {number} x0 origin.x
 * @property {number} y0 origin.y
 * @property {number} width width
 * @property {number} height height
 * @property {Point} topLeft top left corner
 * @property {Point} topRight top right corner
 * @property {Point} bottomLeft bottom left corner
 * @property {Point} bottomRight bottom right corner
 * @property {LineSegment} top top side
 * @property {LineSegment} bottom bottom side
 * @property {LineSegment} left left side
 * @property {LineSegment} right right side
 * */
class Rectangle extends Shape2D {
    constructor(x0, y0, width, height) {
        super();

        this.x0 = x0;
        this.y0 = y0;

        this.width = width;
        this.height = height;

        this.topLeft = new Point(x0, y0);
        this.topRight = new Point(x0 + width, y0);
        this.bottomLeft = new Point(x0, y0 + height);
        this.bottomRight = new Point(x0 + width, y0 + height);

        this.top = new LineSegment(this.topLeft, this.topRight);
        this.bottom = new LineSegment(this.bottomLeft, this.bottomRight);
        this.left = new LineSegment(this.topLeft, this.bottomLeft);
        this.right = new LineSegment(this.topRight, this.bottomRight);
    }

    canvasIntersection(canvasBoundingBox) {
        const { x0: x, y0: y, width: w, height: h } = this;
        const { x0, y0, width, height } = canvasBoundingBox;

        // Get the upper left point of the intersection by checking for out canvas
        const xLeft = Math.max(x, x0);
        const yUp = Math.max(y, y0);

        // Take the bottom right point of the intersection, and subtract upper left point
        return new BoundingBox(
            Math.floor(xLeft), // left X
            Math.floor(yUp), // upper Y
            Math.ceil(Math.min(xLeft + w, width) - xLeft), // right X - left X = width
            Math.ceil(Math.min(yUp + h, height) - yUp), // bottom Y - upper Y = height
        );
    }

    area() {
        const { width, height } = this;

        return width * height;
    }

    /**
     * Draw the rectangle on the given canvas in the given color.
     * @param {Canvas} canvas The canvas to be drawn on.
     * @param {Color} color The color to be drawn in.
     */
    draw(canvas, color) {
        canvas.fillRectangle(this, color);
    }

    equals(other) {
        const { x: x1, y: y1, w: w1, h: h1 } = this;
        const { x: x2, y: y2, w: w2, h: h2 } = other;

        return x1 === x2 && y1 === y2 && w1 === w2 && h1 === h2;
    }
}

export default Rectangle;