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
 * @param {Color} cB backdrop color
 * @param {Color} cS source color
 * @return {Color} blended color
 */
function blend(cB, cS) {
    const { r: rB, g: gB, b: bB, a: aB } = cB;
    const { r: rS, g: gS, b: bS, a: aS } = cS;

    const alphaBlend = (aB, aS) => aS + aB * (1 - aS);
    const colorBlend = (cB, aB, cS, aS) => aS * cS + aB * cB * (1 - aS);

    const a = alphaBlend(aB, aS);
    const r = colorBlend(rB, aB, rS, aS) / a;
    const g = colorBlend(gB, aB, gS, aS) / a;
    const b = colorBlend(bB, aB, bS, aS) / a;
    
    return new Color(r, g, b, a);
}

export { Color, getRandomColor, blend };