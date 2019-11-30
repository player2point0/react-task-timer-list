class TaskContainer {
    constructor(name, duration){
        this.id = Date.now()+"task";
        this.name = name;
        this.duration = duration;
        this.started = false;
        this.isViewing = false;
    }


}

export default TaskContainer;