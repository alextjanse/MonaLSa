import BoundingBox from '../boundingBox.js';

class Shape {
    constructor() {
    }

    /**
     * Draw the shape on the given canvas in the given color.
     * @param {Canvas} canvas The canvas to be drawn on.
     * @param {Color} color The color to be drawn in.
     * @abstract
     */
    draw(canvas, color) {
        throw new Error('Method "Shape.draw()" must be implemented.')
    }

    equals(other) {
        throw new Error('Method "Shape.equals(other)" must be implemented.')
    }
}

class Shape1D extends Shape {
    constructor() {
        super();
    }

    length() {
        throw new Error('Method "Shape1D.length()" must be implemented.')
    }
}

class Shape2D extends Shape {
    constructor() {
        super();
    }

    area() {
        throw new Error('Method "Shape2D.area()" must be implemented.')
    }
    
    /**
     * Create the intersection box of the canvas and the shape.
     * @abstract
     * @param {BoundingBox} canvasBoundingBox 
     * @return {BoundingBox}
     */
    canvasIntersection(canvasBoundingBox) {
        throw new Error('Method "canvasIntersection(canvasBoundingBox)" must be implemented.')
    }
}

export { Shape, Shape1D, Shape2D };