
SESSION = {
    sessionType: undefined,
    timerToggle: undefined,
    intervalId: undefined,
    time: undefined,
    minutes: 0,
    seconds: 0,
    hours: 0,
};

function toggleSessionType() {
    let type = SESSION.sessionType.innerHTML;
    if (type == "Work") {
        SESSION.sessionType.innerHTML = "Rest";
    } else {
        SESSION.sessionType.innerHTML = "Work";
    }
}

function incrementTime() {
    SESSION.seconds += 1;
    if (SESSION.seconds == 60) {
        SESSION.minutes += 1;
        SESSION.seconds = 0;
    }
    if (SESSION.minutes == 60) {
        SESSION.hours += 1;
        SESSION.minutes = 0;
    }
    let h = SESSION.hours.toString().padStart(2, "0");
    let m = SESSION.minutes.toString().padStart(2, "0");
    let s = SESSION.seconds.toString().padStart(2, "0");
    let str = `${h}:${m}:${s}`;
    SESSION.time.innerHTML = str;
}

function toggleTimer() {
    let text = SESSION.timerToggle.innerHTML;
    if (text == "Pause session") {
        SESSION.timerToggle.innerHTML = "Start session";
        clearInterval(SESSION.intervalId);
    } else {
        SESSION.timerToggle.innerHTML = "Pause session";
        SESSION.intervalId = setInterval(incrementTime, 1000);
    }
}

window.onload = () => {
    SESSION.timerToggle = document.getElementById("session-toggle");
    SESSION.timerToggle.onclick = () => toggleTimer();
    SESSION.timerToggle.innerHTML = "Start session";

    SESSION.sessionType = document.getElementById("session-type");
    SESSION.sessionType.innerHTML = "Work";

    SESSION.time = document.getElementById("time");
};