const SESSION_TYPES = ["work", "break"];
const TIME_VALUES = ["hours", "minutes"];
const DEFAULT_TIMES = { work: 25, break: 5 };
let audioLoopCount = 0;

class Timer {
  constructor(hours, minutes) {
    this.seconds = 0;
    this.hours = hours;
    this.minutes = minutes;
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
    let time = this.hours > 0 ? `${h}:` : "";
    return time + `${m}:${s}`;
  }
}

function playRingTone() {
  const audio = document.getElementsByTagName("audio")[0];
  audio.onseeked = () => {
    // Only loop up to 3 times
    audioLoopCount++;
    if (audioLoopCount >= 3) {
      audioLoopCount = 0;
      audio.pause();
      audio.currentTime = 0;
    }
  };
  audio.play();
}

class Pomodoro {
  constructor(elements) {
    this.isWork = false;
    this.isPaused = false;
    this.workTimer = new Timer(0, 0);
    this.breakTimer = new Timer(0, 0);
    this.intervalId = undefined;
    this.elements = elements;
  }

  toggleTimer() {
    if (this.isPaused) {
      this.elements.toggleButton.innerHTML = "Resume session";
      clearInterval(this.intervalId);
      this.isPaused = false;
    } else {
      this.elements.toggleButton.innerHTML = "Pause session";
      this.intervalId = setInterval(() => this.updateTimer(), 1000);
      this.isPaused = true;
    }
  }

  loadTimerValues() {
    this.workTimer.seconds = 0;
    this.breakTimer.seconds = 0;

    // Load timer values from localstorage
    for (let session of SESSION_TYPES) {
      for (let value of TIME_VALUES) {
        let stored = localStorage.getItem(`${session}-${value}`);
        let timer = session == "work" ? this.workTimer : this.breakTimer;
        if (value == "hours") {
          timer.hours = stored != undefined ? parseInt(stored) : 0;
        } else {
          timer.minutes =
            stored != undefined ? parseInt(stored) : DEFAULT_TIMES[session];
        }
      }
    }
  }

  toggleSessionType() {
    playRingTone();

    if (this.isWork) {
      this.elements.sessionHeader.innerHTML = "Break";
      this.isWork = false;
    } else {
      this.elements.sessionHeader.innerHTML = "Work";
      this.isWork = true;
    }

    this.loadTimerValues();
  }

  updateTimer() {
    let timer = this.isWork ? this.workTimer : this.breakTimer;
    timer.countdown();
    if (timer.hours < 0) {
      this.toggleSessionType();
    }

    let newTimer = this.isWork ? this.workTimer : this.breakTimer;
    this.elements.timeHeader.innerHTML = newTimer.format();

    document.title = `${this.isWork ? "Work" : "Break"} - ${newTimer.format()}`;
  }
}

function initTimerInputs() {
  for (let session of SESSION_TYPES) {
    for (let value of TIME_VALUES) {
      let id = `${session}-${value}`;
      let element = document.getElementById(id);

      // Set the input value to the value already in localStorage
      let existingValue = localStorage.getItem(id);
      if (existingValue !== null) {
        element.value = `${existingValue}`;
      } else {
        let n = value == "minutes" ? DEFAULT_TIMES[session] : 0;
        element.value = `${n}`;
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
      };
    }
  }
}

function bindPopupEvents(pomodoro) {
  let popup = document.getElementById("settings-popup");
  let closeButton = document.getElementById("popup-close-button");
  let openButton = document.getElementById("popup-open-button");

  // Toggle the visibility of the popup
  openButton.onclick = () => (popup.style.display = "block");
  closeButton.onclick = () => {
    popup.style.display = "none";
    if (pomodoro.isPaused) {
      pomodoro.toggleTimer();
    }
    pomodoro.loadTimerValues();
  };
}

window.onload = () => {
  let timeHeader = document.getElementById("time");
  let timerToggle = document.getElementById("timer-toggle");
  let sessionHeader = document.getElementById("session-header");

  let elements = {
    sessionHeader: sessionHeader,
    timeHeader: timeHeader,
    toggleButton: timerToggle,
  };
  let pomodoro = new Pomodoro(elements);

  timerToggle.onclick = () => pomodoro.toggleTimer();
  pomodoro.toggleSessionType(); // Start off with a work session
  timeHeader.innerHTML = pomodoro.workTimer.format();
  bindPopupEvents(pomodoro);
  initTimerInputs();
};
