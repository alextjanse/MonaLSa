class BoundingBox {
    constructor(x0, y0, width, height) {
        /** @type {number} */
        this.x0 = x0;
        /** @type {number} */
        this.y0 = y0;
        /** @type {number} */
        this.width = width;
        /** @type {number} */
        this.height = height;
    }

    * loop() {
        const { x0, y0, width, height } = this;

        for (let xOffset = 0; xOffset < width; xOffset++) {
            for (let yOffset = 0; yOffset < height; yOffset++) {
                const x = x0 + xOffset;
                const y = y0 + yOffset;

                yield { x, y };
            }
        }
    }

    equals(other) {
        const { x0, y0, width, height } = this;
        const { x1, y1, w, h } = other;
        
        return x0 === x1 && y0 === y1 && width === w && height === h;
    }
}

export default BoundingBox;