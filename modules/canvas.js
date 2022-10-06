import { Color } from './color.js';
import { Triangle } from './math.js';

class Canvas {
    constructor(id) {
        this.html = document.getElementById(id);
        this.ctx = this.html.getContext('2d');
        this.width = null;
        this.height = null;
    }

    setDimensions(width, height) {
        const { html } = this;

        this.width = width;
        this.height = height;
        
        html.width = width;
        html.height = height;
    }

    getData(x, y, w, h) {
        const { ctx } = this;

        return ctx.getImageData(x, y, w, h).data;
    }

    clear() {
        const { ctx, width, height } = this;

        ctx.clearRect(0, 0, width, height);
    }

    /**
     * Draw the triangle on the canvas
     * @param {Triangle} triangle
     */
    drawTriangle(triangle) {
        const { ctx } = this;

        const { p1, p2, p3, c } = triangle;

        const { x: x1, y: y1 } = p1;
        const { x: x2, y: y2 } = p2;
        const { x: x3, y: y3 } = p3;
        const { r, g, b, a } = c;

        // Set the color
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;

        // Make path of triangle
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        
        // Draw
        ctx.fill();
    }
}

class OriginalCanvas extends Canvas {
    constructor(id, image) {
        super(id);
        this.image = image;
        this.data = null;
    }

    draw() {
        const { ctx, image, width, height } = this;
        let { data } = this;

        ctx.drawImage(image, 0, 0);
        data = ctx.getImageData(0, 0, width, height).data;
    }

    getPixel(x, y) {
        const { data, width } = this;

        const index = 4 * (y * width + x);
        
        // c = [r, g, b, a]
        const c = data.slice(index, 4);

        return Color(...c);
    }
}

export { Canvas, OriginalCanvas };