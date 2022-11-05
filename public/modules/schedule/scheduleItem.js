class ScheduleItem {
    constructor(parameterSet, length) {
        this.parameterSet = parameterSet;
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