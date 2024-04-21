
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
        SESSION.timerToggle.innerHTML = "Resume session";
        clearInterval(SESSION.intervalId);
        SESSION.isPaused = false;
    } else {
        SESSION.timerToggle.innerHTML = "Pause session";
        SESSION.intervalId = setInterval(updateTimer, 1000);
        SESSION.isPaused = true;
    }
}

function initTimerInputs() {
    let sessionTypes = ["work", "rest"];
    let timeValues = ["hours", "minutes"];

    for (let session of sessionTypes) {
        for (let value of timeValues) {
            let id = `${session}-${value}`;
            let element = document.getElementById(id);

            // Set the input value to the value already in localStorage
            let existingValue = localStorage.getItem(id);
            if (existingValue !== undefined) {
                element.value = `${existingValue}`;
            }

            // Update the value of our input element in localStorage
            element.oninput = () => {
                if (element.value.length == 0) {
                    return;
                }

                // Make sure the number is within range
                let num = parseInt(element.value);
                let max = value == "hours" ? 24 : 59;
                let clamped = Math.max(0, Math.min(num, max));
                if (num != clamped) {
                    element.value = `${clamped}`;
                }

                // Update the input's value in localstorage
                localStorage.setItem(id, num);
            };

            // Make sure the input is never empty
            element.onblur = () => {
                if (element.value.length == 0) {
                    element.value = "0";
                }
            }
        }
    }
}

function bindPopupEvents() {
    let popup = document.getElementById("settings-popup");
    let closeButton = document.getElementById("popup-close-button");
    let openButton = document.getElementById("popup-open-button");

    // Toggle the visibility of the popup
    closeButton.onclick = () => popup.style.display = "none";
    openButton.onclick = () => popup.style.display = "block";
}

window.onload = () => {
    let audio = new Audio("ping.mp3");
    audio.play();

    SESSION.timerToggle = document.getElementById("session-toggle");
    SESSION.timerToggle.onclick = () => toggleTimer();
    SESSION.timerToggle.innerHTML = "Start session";

    SESSION.sessionType = document.getElementById("session-type");
    SESSION.sessionType.innerHTML = "Work";

    SESSION.time = document.getElementById("time");

    toggleSessionType(); // Start off with a work session

    initTimerInputs();
    bindPopupEvents();
};