
class Timer {
    constructor(minutes) {
        this.seconds = 0;
        this.hours = Math.floor(minutes / 60);
        this.minutes = minutes - (this.hours * 60);
    }

    countdown() {
        this.seconds -= 1;
        if (this.seconds <= 0) {
            this.seconds = 59;
            this.minutes -= 1;
            if (this.minutes < 0) {
                this.hours -= 1;
                this.minutes = 59;
            }
        }
    }

    format() {
        let h = this.hours.toString().padStart(2, "0");
        let m = this.minutes.toString().padStart(2, "0");
        let s = this.seconds.toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    }
}

SESSION = {
    workTimer: undefined,
    restTimer: undefined,
    isWork: false,
    isPaused: false,

    // References to elements
    sessionType: undefined,
    timerToggle: undefined,
    intervalId: undefined,
    time: undefined
};

function toggleSessionType() {
    if (SESSION.isWork) {
        SESSION.sessionType.innerHTML = "Rest";
        SESSION.isWork = false;
    } else {
        SESSION.sessionType.innerHTML = "Work";
        SESSION.isWork = true;
    }

    // Reset both timers
    SESSION.workTimer = new Timer(25);
    SESSION.restTimer = new Timer(4);
}

function updateTimer() {
    let timer = SESSION.isWork ? SESSION.workTimer : SESSION.restTimer;
    timer.countdown();
    if (timer.hours < 0) {
        toggleSessionType();
    }

    let newTimer = SESSION.isWork ? SESSION.workTimer : SESSION.restTimer;
    SESSION.time.innerHTML = newTimer.format();
}

function toggleTimer() {
    if (SESSION.isPaused) {
        SESSION.timerToggle.innerHTML = "Start session";
        clearInterval(SESSION.intervalId);
        SESSION.isPaused = false;
    } else {
        SESSION.timerToggle.innerHTML = "Pause session";
        SESSION.intervalId = setInterval(updateTimer, 1000);
        SESSION.isPaused = true;
    }
}

window.onload = () => {
    SESSION.timerToggle = document.getElementById("session-toggle");
    SESSION.timerToggle.onclick = () => toggleTimer();
    SESSION.timerToggle.innerHTML = "Start session";

    SESSION.sessionType = document.getElementById("session-type");
    SESSION.sessionType.innerHTML = "Work";

    SESSION.time = document.getElementById("time");

    toggleSessionType(); // Start off with a work session

    // Toggle the visibility of the settings popup using buttons
    let popup = document.getElementById("settings-popup");
    let closeButton = document.getElementById("popup-close-button");
    let settingsButton = document.getElementById("popup-open-button");
    closeButton.onclick = () => popup.style.display = "none";
    settingsButton.onclick = () => popup.style.display = "block";
};