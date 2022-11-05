import { randomInRange } from "../utils.js";
import FocusField from "./focusField.js";

/**
 * @typedef shapeParameters
 * @prop {number} areaLb lower bound of the area randomizer
 * @prop {number} areaUb upper bound of the area randomizer
 */

/**
 * @typedef colorParameters
 * @prop {number} alpha the alpha channel of the color
 */

export default class ParameterSet {
    constructor(focusField, shapeParameters, colorParameters) {
        /** @type {FocusField} */
        this.focusField = focusField;
        /** @type {shapeParameters} */
        this.shapeParameters = shapeParameters;
        /** @type {colorParameters} */
        this.colorParameters = colorParameters;
    }

    getRandomPoint() {
        const { focusField } = this;

        return focusField.getPointInField();
    }

    area() {
        const { shapeParameters: { areaLb, areaUb } } = this;

        return randomInRange(areaLb, areaUb);
    }

    get alpha() {
        const { colorParameters: { alpha } } = this;
        return alpha;
    }
}