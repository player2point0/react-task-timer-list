export async function requestNotifications() {
    const status = await Notification.requestPermission();
    console.log("notifications : " + status);
}

export function sendNotification(title, text, onClickFunc) {
    const displayDuration = 6000;

    const options = {
        title: title,
        body: text,
    };
    const notification = new Notification(title, options);

    notification.onclick = onClickFunc;

    notification.addEventListener("click", onClickFunc);

    setTimeout(closeNotification(notification, onClickFunc), displayDuration);
}

function closeNotification(notification, onClickFunc) {

    notification.removeEventListener("click", onClickFunc);
    notification.close.bind(notification);
}

export function formatTime(time) {
    let hours = String(Math.floor(time / 3600));
    let mins = String(Math.floor((time - hours * 3600) / 60));
    let seconds = String(Math.floor(time - hours * 3600 - mins * 60));

    if (hours.length < 2) hours = "0" + hours;
    if (mins.length < 2) mins = "0" + mins;
    if (seconds.length < 2) seconds = "0" + seconds;

    return hours + ":" + mins + ":" + seconds;
}

export function formatDayMonth(d){
	let date = d.getDate();
	let month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
	let year = d.getFullYear();

	return date + "/" + month + "/" + year;
}

export function padNumWithZero(val) {
    if(val < 10) return "0"+val;
    return val;
}