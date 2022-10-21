import { pickRandomly } from "./utils.js";

/**
 * @constructor
 * @param {number} r [0..255]
 * @param {number} g [0..255]
 * @param {number} b [0..255]
 * @param {number} a [0..255] | [0..1]
 * @return {Color}
 */
class Color {
    constructor(r, g, b, a) {
        if (a > 1) {
            a /= 255;
        }

        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}

// Source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    return new Color(r, g, b, 0);
}

// Source: https://www.schemecolor.com/mona-lisa-painting-colors.php
const color1 = hexToRgb('727F4B');
const color2 = hexToRgb('A9A569');
const color3 = hexToRgb('E9C468');
const color4 = hexToRgb('92692E');
const color5 = hexToRgb('92692E');
const color6 = hexToRgb('352524');
const palette = [color1, color2, color3, color4, color5, color6];

/**
 * Get random color, with given alpha level.
 * @param {Number} alpha alpha level
 */
function getRandomColor(alpha) {
    const color = pickRandomly(palette);

    color.a = alpha;

    return color;
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

    if (a === 0) return new Color(0, 0, 0, 0);

    const r = blendColorChannel(r1, a1, r2, a2, a);
    const g = blendColorChannel(g1, a1, g2, a2, a);
    const b = blendColorChannel(b1, a1, b2, a2, a);

    return new Color(r, g, b, a);
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