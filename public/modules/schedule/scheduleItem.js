import ParameterSet from "../parameters/parameterSet.js";

class ScheduleItem {
    /**
     * @param {ParameterSet} parameterSet the parameters
     * @param {number} length The number of iterations in this schedule
     */
    constructor(parameterSet, length) {
        /** @type {ParameterSet} */
        this.parameterSet = parameterSet;
        /** @type {number} */
        this.length = length;
    }

    * iteration() {
        const { parameterSet, length } = this;

        for (let i = 0; i < length; i++) {
            yield parameterSet;
        }
    }
}

export default ScheduleItem;