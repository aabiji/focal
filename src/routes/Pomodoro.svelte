<script>
  import { onMount } from "svelte";
  import { dev } from "$app/environment";
  import { app, nextSession, togglePause } from "./state";
  import { Icon } from "svelte-icons-pack";
  import { BiPause, BiPlay, BiSolidCog } from "svelte-icons-pack/bi";

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
      const audio = new Audio(dev ? `/tone.mp3` : "tone.mp3");
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
  <div class="controls">
    <button on:click={toggleTimer}>
      <Icon src={$app.paused ? BiPlay : BiPause} color={`${$app.fgShade}`} size="32" />
    </button>
    <button on:click={() => (showSettingsPopup = true)}>
        <Icon src={BiSolidCog} color={`${$app.fgShade}`} size="22" />
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

  .controls {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
