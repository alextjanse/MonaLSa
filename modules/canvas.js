import { Color } from './color.js';
import { Point, Rectangle, Triangle } from './math.js';

/**
 * Canvas class.
 * @property {HTMLElement} html The HTML element of the canvas
 * @property {CanvasRenderingContext2D} context The 2D context of the canvas
 * 
 * @property {number} width Width of the canvas
 * @property {number} height Height of the canvas
 * 
 * @property {Rectangle} dataFrame Data frame
 * @property {ImageData} data Image data of the current data frame
 * @property {boolean} newDataFlag Flag for data getter, so we don't scan the same place twice
 */
class Canvas {
    constructor(id) {
        /** @type {HTMLElement} */
        this.html = document.getElementById(id);
        /** @type {CanvasRenderingContext2D} */
        this.context = this.html.getContext('2d', { willReadFrequently: true });
        this.context.will

        this.width = null;
        this.height = null;

        this.dataFrame = null;
        this.data = null;
        this.newDataFlag = true;
    }

    setDimensions(width, height) {
        const { html } = this;

        this.width = width;
        this.height = height;
        
        html.width = width;
        html.height = height;
    }

    /** 
     * Load the data of the data frame into canvas.data.
     * @param {Rectangle} dataFrame The frame of data we want.
     */
    loadData(dataFrame) {
        const { context, dataFrame: currentFrame, newDataFlag } = this;
        const { x0, y0, width, height } = dataFrame;

        if (!newDataFlag && (currentFrame && dataFrame.equals(currentFrame))) {
            return;
        }

        this.data = context.getImageData(x0, y0, width, height).data;

        this.dataFrame = dataFrame;

        this.newDataFlag = false;
    }

    getPixel(x, y) {
        const { data, dataFrame: { x0, y0, width } } = this;

        const index = 4 * (y - y0) * width + (x - x0);
        
        // c = [r, g, b, a]
        const c = data.slice(index, index + 4);

        return new Color(...c);
    }

    clear() {
        const { context, width, height } = this;

        context.clearRect(0, 0, width, height);
    }

    fillPath(points, color) {
        const { context } = this;
        const {r, g, b, a } = color;

        // Set the color
        context.fillStyle = `rgba(${r},${g},${b},${a})`;

        // Follow the points to draw a path
        points.forEach(({ x, y }) => context.moveTo(x, y));

        context.fill();

        this.newDataFlag = true;
    }
}

class OriginalCanvas extends Canvas {
    constructor(id, image) {
        super(id);
        this.image = image;
        this.data = null;
    }

    setDimensions(width, height) {
        super.setDimensions(width, height);

        this.dataFrame = new Rectangle(0, 0, width, height);
    }

    drawImage() {
        const { context, image, dataFrame } = this;

        context.drawImage(image, 0, 0);
        this.newDataFlag = true;

        this.loadData(dataFrame);
    }
}

export { Canvas, OriginalCanvas };