

export function formatTime(time){
    let hours = String(Math.floor(time / 3600));
    let mins = String(Math.floor((time - (hours * 3600)) / 60));
    let seconds  = String(Math.floor((time - (hours * 3600) - (mins * 60))));
    
    if(hours.length < 2) hours = "0"+hours;
    if(mins.length < 2) mins = "0"+mins;
    if(seconds.length < 2) seconds = "0"+seconds;

    return hours+":"+mins+":"+seconds;
}

export function getDateStr(){
    let d = new Date();
        
    let date = d.getDate();
    let month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    let year = d.getFullYear();
    
    return date + "/" + month + "/" + year;
}