import ScheduleItem from "./scheduleItem.js";

class Schedule {
    /**
     * @param {ScheduleItem[]} scheduleItems The list of schedule items
     * @param {boolean} loopEnd whether to loop the last schedule item or not
     */
    constructor(scheduleItems, loopEnd) {
        /** @type {ScheduleItem[]} */
        this.scheduleItems = scheduleItems;
        /** @type {boolean} */
        this.loopEnd = loopEnd;
    }

    * iteration() {
        const { scheduleItems, loopEnd } = this;

        for (const currentItem of scheduleItems) {
            yield* currentItem.iteration();
        }

        if (loopEnd) {
            const lastItem = scheduleItems[scheduleItems.length - 1];
            
            while (true) { 
                yield* lastItem.iteration();
            }
        }
    }
}

export default Schedule;