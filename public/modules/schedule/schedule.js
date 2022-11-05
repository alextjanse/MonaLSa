import ScheduleItem from "./scheduleItem.js";

class Schedule {
    constructor(scheduleItems, loopEnd) {
        this.scheduleItems = scheduleItems;
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