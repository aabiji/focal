<script>
    import * as utils from "./utils";
    import { app } from "./app";
    import { onMount } from "svelte";

    export let showSettingsPopup;

    let session = "Focus time!";
    let time = utils.formatTime(0, 0, 0);
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    // Deep copy of the timer durations
    let prevDurations = JSON.parse(JSON.stringify($app.durations));
    let timer; // Returned from setInterval
    let icon = $app.getPlaybackIcon();

    onMount(() => {
        session = $app.gotoNextSession();
        let duration = $app.getSessionDuration();
        [hours, minutes, seconds] = utils.getTimeValues(duration);
    });

    const signalSessionChange = () => {
        if ($app.showNotification) {
            const body = $app.getSessionMessage();
            new Notification("Focal", { body, icon: "" });
        }

        if ($app.playRingtone) {
            const audio = new Audio(getPath("tone.mp3"));
            audio.play();
        }
    };

    const tickTimer = () => {
        seconds -= 1;
        if (seconds < 0) {
            seconds = 59;
            minutes -= 1;
            if (minutes < 0) {
                minutes = 59;
                hours -= 1;
            }
        }

        if (hours < 0) {
            session = $app.gotoNextSession();
            let duration = $app.getSessionDuration();
            [hours, minutes, seconds] = utils.getTimeValues(duration);
            signalSessionChange();
        }
    };

    const toggleTimer = () => {
        if ($app.playMusic)
            $app.music.togglePlayback();
        if ($app.paused) {
            clearInterval(timer);
        } else {
            timer = setInterval(() => tickTimer(), 1000);
        }
        $app.paused = $app.paused === undefined ? true : !$app.paused;
        icon = $app.getPlaybackIcon();
    };

    // Only change the timer when its values are changed in the settings
    // when we're paused and the value changed is relevant to our current session
    $: {
        let i = $app.currentSession;
        let valid = i != -1 && $app.music.paused;
        let valueChanged = prevDurations[i] != $app.durations[i];
        if (valid && valueChanged) {
            let duration = $app.getSessionDuration();
            [hours, minutes, seconds] = utils.getTimeValues(duration);
            prevDurations = JSON.parse(JSON.stringify($app.durations));
        }
    }

    // Update the timer when its values change
    $: time = utils.formatTime(hours, minutes, seconds);
</script>

<div class="container">
    <p>{session}</p>
    <h1>{time}</h1>
    <div class="controls">
        <button on:click={() => toggleTimer()}>
            <img src={icon} alt="play icon" />
        </button>
        <button on:click={() => (showSettingsPopup = true)}>
            <img src={utils.getPath("settings.svg")} alt="settings icon" />
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
