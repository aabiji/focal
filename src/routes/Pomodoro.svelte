<script>
  import { onMount } from "svelte";
  import { app, getPath, nextSession, togglePause } from "./state";

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds - (h * 3600)) / 60);
    const s = totalSeconds - h * 3600 - m * 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const sessionMinutes = () => {
    return $app.isBreak
      ? $app.breakCount !== 4 ? $app.shortBreakMinutes : $app.longBreakMinutes
      : $app.workMinutes;
  }

  export let showSettingsPopup;
  let totalSeconds = 0, timeDifference = 0;
  let startTime, timer;

  onMount(() => {
    nextSession();
    timeDifference = sessionMinutes() * 60;
  });

  const signalSessionChange = () => {
    if ($app.showNotification)
      new Notification("Focal", { body: $app.sessionNotification, icon: "" });

    if ($app.playRingtone) {
      const audio = new Audio(getPath("tone.mp3"));
      audio.play();
    }
  }

  const toggleTimer = () => {
    togglePause();
    if ($app.paused) {
      clearInterval(timer);
    } else {
      startTime = new Date();

      timer = setInterval(() => {
        const elapsedSeconds = Math.floor((new Date() - startTime) / 1000);
        const totalMinutes = Math.floor((totalSeconds + elapsedSeconds) / 60);
        if (totalMinutes >= sessionMinutes()) {
          nextSession();
          signalSessionChange();
        }
        timeDifference = (sessionMinutes() * 60) - (totalSeconds + elapsedSeconds);
      });
    }
  }
</script>

<div class="container">
  <p>{$app.sessionName}</p>
  <h1>{formatTime(timeDifference)}</h1>
  <div class="controls" >
    <button on:click={toggleTimer}>
      <img src={$app.paused ? getPath("play.svg") : getPath("pause.svg")} alt="play icon" />
    </button>
    <button on:click={() => (showSettingsPopup = true)}>
      <img src={getPath("settings.svg")} alt="settings icon" />
    </button>
  </div>
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  h1 {
    font-size: 50px;
    color: purple;
    font-family: "Arial Rounded";
    font-weight: bold;
  }

  p {
    margin-bottom: -20px;
    font-size: 20px;
    color: purple;
    font-weight: bold;
  }

  .controls button {
    cursor: pointer;
    background: none;
    outline: none;
    border: none;
  }

  .controls button img {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
</style>
