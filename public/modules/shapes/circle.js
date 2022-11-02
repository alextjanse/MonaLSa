import Point from "./point.js";
import { Shape2D } from "./shape.js";
import { Canvas } from '../canvas.js';
import BoundingBox from "../boundingBox.js";

/**
 * Circle class
 * @property {Point} origin Origin
 * @property {number} radius Radius
 */
class Circle extends Shape2D {
    /**
     * Create a Circle object
     * @param {Point} origin Origin
     * @param {number} radius Radius
     */
    constructor(origin, radius) {
        super();
        
        this.origin = origin;
        this.radius = radius;
    }

    /**
     * Create the intersection box of the canvas and the circle.
     * @param {BoundingBox} canvasBoundingBox 
     * @return {BoundingBox}
     */
    canvasIntersection(canvasBoundingBox) {
        const { origin: { x: xOrigin, y: yOrigin }, radius } = this;
        const { x0, y0, width, height } = canvasBoundingBox;
        
        const xmin = Math.max(Math.floor(xOrigin - radius), x0);
        const xmax = Math.min(Math.ceil(xOrigin + radius), x0 + width);
        const ymin = Math.max(Math.floor(yOrigin - radius), y0);
        const ymax = Math.min(Math.ceil(yOrigin + radius), y0 + height);
        
        return new BoundingBox(xmin, ymin, xmax - xmin, ymax - ymin);
    }

    area() {
        const { radius } = this;

        return Math.PI * (radius**2);
    }

    /**
     * Draw the circle on the given canvas in the given color.
     * @param {Canvas} canvas The canvas to be drawn on.
     * @param {Color} color The color to be drawn in.
     */
    draw(canvas, color) {
        const { origin: { x, y }, radius } = this;
        const { context } = canvas;
        
        canvas.setColor(color);

        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);

        context.fill();
    }

    equals(other) {
        const { origin: p1, radius: r1 } = this;
        const { origin: p2, radius: r2 } = other;

        return p1.equals(p2) && r1 === r2;
    }
}

export default Circle;