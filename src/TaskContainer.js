class TaskContainer {
    constructor(name, duration){
        this.id = this.uuidv4();
        this.name = name;
        //time in seconds
        this.totalDuration = duration;
        this.remainingTime = duration;
        this.additionalTime = Number(duration / 2);
        this.timeUp = false;
        this.started = false;
        this.paused = false;
        this.isViewing = false;
        this.stats = {
          timeAdded: 0,
          timesPaused: 0,
        };

        this.test = "testing";
    }

    addTime(){
      let extraTime = Number(this.remainingTime) + this.additionalTime;
      this.remainingTime = extraTime;
      this.timeUp = false;
      
      this.stats.timeAdded += extraTime;
    }

    pause(){
      this.paused = true;
    }

    unPause(){
      this.paused = false;
    }

    //unique id generator
    uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
}

export default TaskContainer;