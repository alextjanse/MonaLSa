import BoundingBox from "../boundingBox.js";
import { getRandomPoint } from "../math.js";

export default class FocusField extends BoundingBox {
    constructor(x0, y0, width, height) {
        super(x0, y0, width, height);
    }

    getPointInField() {
        const { x0, y0, width, height } = this;
        
        return getRandomPoint(x0, x0 + width, y0, y0 + height);
    }
}