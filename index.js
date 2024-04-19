
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
    intervalId: undefined,

    // References to elements
    sessionType: undefined,
    timerToggle: undefined,
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

    document.title = `${SESSION.isWork ? "Work" : "Rest"} - ${newTimer.format()}`;
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

// TODO: set the values (from localStorage) of the inputs when we open the popup
// TODO: bind onfocusout event
function bindTimerInputs() {
    let sessionTypes = ["work", "rest"];
    let inputTypes = ["hours", "minutes"];

    for (let session of sessionTypes) {
        for (let input of inputTypes) {
            let id = `${session}-${input}`;
            let element = document.getElementById(id);
            element.oninput = () => {
                if (element.value.length == 0) {
                    return;
                }

                // Make sure the number is within range
                let num = parseInt(element.value);
                let max = input == "hours" ? 24 : 59;
                let clamped = Math.max(0, Math.min(num, max));
                if (num != clamped) {
                    element.value = `${clamped}`;
                }

                // Update the input's value in localstorage
                localStorage.setItem(id, num);
            };
        }
    }
}

// Toggle the visibility of the popup
function bindPopupEvents() {
    let popup = document.getElementById("settings-popup");
    let closeButton = document.getElementById("popup-close-button");
    let openButton = document.getElementById("popup-open-button");
    closeButton.onclick = () => popup.style.display = "none";
    openButton.onclick = () => popup.style.display = "block";
}

window.onload = () => {
    SESSION.timerToggle = document.getElementById("session-toggle");
    SESSION.timerToggle.onclick = () => toggleTimer();
    SESSION.timerToggle.innerHTML = "Start session";

    SESSION.sessionType = document.getElementById("session-type");
    SESSION.sessionType.innerHTML = "Work";

    SESSION.time = document.getElementById("time");

    toggleSessionType(); // Start off with a work session
    bindTimerInputs();
    bindPopupEvents();
};