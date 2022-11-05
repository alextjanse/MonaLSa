import { pickRandomly, randomInRange } from "./utils.js";

/**
 * @class
 * @prop {number} r [0..255]
 * @prop {number} g [0..255]
 * @prop {number} b [0..255]
 * @prop {number} a [0..255] | [0..1]
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

let colorPalette;

const setColorPalette = (palette) => {
    colorPalette = palette;
}

function generateColor(parameters) {
    const alpha = parameters.alpha;

    return generateRandomColor(alpha);
}

/**
 * Get random color, with given alpha level.
 * @param {Number} alpha alpha level
 */
function pickRandomColorFromPalette(alpha) {
    const color = pickRandomly(colorPalette);

    color.a = alpha;

    return color;
}

function generateRandomColor(alpha) {
    const r = Math.floor(randomInRange(0, 256));
    const g = Math.floor(randomInRange(0, 256));
    const b = Math.floor(randomInRange(0, 256));
    
    return new Color(r, g, b, alpha);
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

export { Color, generateColor, blend, setColorPalette as setPalette };