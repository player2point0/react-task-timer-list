class TaskContainer {
    constructor(name, duration, date, savedTask){
        
      if(savedTask){
        this.id = savedTask.id;
        this.name = savedTask.name;
        this.date = savedTask.date;
        //time in seconds
        this.totalDuration = savedTask.totalDuration;
        this.remainingTime = savedTask.remainingTime;
        this.additionalTime = savedTask.additionalTime;
        this.timeUp = savedTask.timeUp;
        this.started = savedTask.started;
        this.paused = savedTask.paused;
        this.isViewing = savedTask.isViewing;
        this.stats = savedTask.stats;
      }  
      
      else{
        this.id = this.uuidv4();
        this.name = name;
        this.date = date;
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
          dateStarted: "",
          dateEnded: "",
        };
      }
    }

    addTime(){
      let extraTime = Number(this.remainingTime) + this.additionalTime;
      this.totalDuration += extraTime;
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