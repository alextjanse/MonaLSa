import { Color } from './color.js';
import { Rectangle, Triangle } from './math.js';

class Canvas {
    constructor(id) {
        this.html = document.getElementById(id);
        this.ctx = this.html.getContext('2d');
        this.width = null;
        this.height = null;

        this.data = null;
        this.newDataFlag = true;

        this.dx = 0;
        this.dy = 0;
        this.dw = 0;
        this.dh = 0;
    }

    setDimensions(width, height) {
        const { html } = this;

        this.width = width;
        this.height = height;
        
        html.width = width;
        html.height = height;
    }

    getData(x, y, w, h) {
        const { ctx, dx, dy, dw, dh, newDataFlag } = this;

        if (!newDataFlag || (x === dx && y === dy && w === dw && h === dh)) {
            return;
        }

        this.data = ctx.getImageData(x, y, w, h).data;
        
        this.dx = x;
        this.dy = y;
        this.dw = w;
        this.dh = h;

        this.newDataFlag = false;
    }

    getPixel(x, y) {
        const { data, dx, dy, dw } = this;

        const index = 4 * (y - dy) * dw + (x - dx);
        
        // c = [r, g, b, a]
        const c = data.slice(index, index + 4);

        return new Color(...c);
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

        const { 
            p1: { x: x1, y: y1 },
            p2: { x: x2, y: y2 },
            p3: { x: x3, y: y3 },
            c: { r, g, b, a },
        } = triangle;

        // Set the color
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;

        // Make path of triangle
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        
        // Draw
        ctx.fill();

        this.newDataFlag = true;
    }
}

class OriginalCanvas extends Canvas {
    constructor(id, image) {
        super(id);
        this.image = image;
        this.data = null;
    }

    drawImage() {
        const { ctx, image, width, height } = this;

        ctx.drawImage(image, 0, 0);
        this.getData(0, 0, width, height);
    }
}

export { Canvas, OriginalCanvas };