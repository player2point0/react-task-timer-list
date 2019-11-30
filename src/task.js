class TaskContainer {
    constructor(name, duration){
        this.id = this.uuidv4();
        this.name = name;
        this.totalDuration = duration;
        this.remainingTime = duration;
        this.started = false;
        this.isViewing = false;
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