<script>
    import * as utils from "./utils";
    import { app } from "./app";
    import { onMount } from "svelte";

    export let show_settings_popup;

    let session = "Focus time!";
    let time = utils.formatTime(0, 0, 0);
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    // Deep copy of the timer durations
    let prev_durations = JSON.parse(JSON.stringify($app.durations));
    let timer; // Returned from setInterval
    let icon = $app.getPlaybackIcon();

    onMount(() => {
        session = $app.gotoNextSession();
        let duration = $app.getSessionDuration();
        [hours, minutes, seconds] = utils.getTimeValues(duration);
    });

    const signalSessionChange = () => {
        if ($app.show_notification) {
            const body = $app.getSessionMessage();
            new Notification("Focal", { body, icon: "" });
        }

        if ($app.play_ringtone) {
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
        $app.music.togglePlayback();
        if ($app.music.paused) {
            clearInterval(timer);
        } else {
            timer = setInterval(() => tickTimer(), 1000);
        }
        icon = $app.getPlaybackIcon();
    };

    // Only change the timer when its values are changed in the settings
    // when we're paused and the value changed is relevant to our current session
    $: {
        let i = $app.current_session;
        let valid = i != -1 && $app.music.paused;
        let value_changed = prev_durations[i] != $app.durations[i];
        if (valid && value_changed) {
            let duration = $app.getSessionDuration();
            [hours, minutes, seconds] = utils.getTimeValues(duration);
            prev_durations = JSON.parse(JSON.stringify($app.durations));
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
        <button on:click={() => (show_settings_popup = true)}>
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
        color: white;
        font-family: "Arial Rounded";
        font-weight: bold;
    }

    p {
        margin-bottom: -20px;
        font-size: 20px;
        color: white;
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
