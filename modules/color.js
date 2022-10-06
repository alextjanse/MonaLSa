/**
 * @constructor
 * @param {number} r [0..255]
 * @param {number} g [0..255]
 * @param {number} b [0..255]
 * @param {number} a [0..255] | [0..1]
 * @return {Color}
 */
function Color(r, g, b, a) {
    if (a > 1) {
        a /= 255;
    }

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}

/**
 * Get random color, with given alpha level.
 * @param {Number} a alpha level
 */
 function getRandomColor(a) {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    
    return Color(r, g, b, a);
}

/**
 * Blend the two colors using alpha compositing: https://en.wikipedia.org/wiki/Alpha_compositing
 * @param {Color} c1 color 1
 * @param {Color} c2 color 2
 * @return {Color} blended color
 */
function blend(c1, c2) {
    const { r: r1, g: g1, b: b1, a: a1 } = c1;
    const { r: r2, g: g2, b: b2, a: a2 } = c2;

    const a = a1 + a2 * (1 - a1);
    
    const r = blendColorChannel(r1, a1, r2, a2);
    const g = blendColorChannel(g1, a1, g2, a2);
    const b = blendColorChannel(b1, a1, b2, a2);

    return { r, g, b, a };
}

/**
 * Blends the color channel (R, G, B)
 * @param {number} c1 color channel of color 1
 * @param {number} a1 alpha channel of color 1
 * @param {number} c2 color channel of color 2
 * @param {number} a2 alpha channel of color 2
 * @param {number} a0 already blended alpha channel
 * @return {number} the blended color channel
 */
function blendColorChannel(c1, a1, c2, a2, a0) {
    return (c1 * a1 + c2 * a2 * (1 - a1)) / a0;
}

export { Color, getRandomColor, blend };