<script>
    import { app, get_path } from "./app";
    import { onMount } from "svelte";

    export let show_settings_popup;
    export let youtube_player;
    export let paused;

    const toggleMusicPlayback = () => {
        if (!$app.play_music) return;
        if (youtube_player.getPlayerState() == 1) {
            youtube_player.pauseVideo();
        } else {
            youtube_player.playVideo();
        }
    };

    const signalSessionChange = () => {
        if ($app.show_notification) {
            const body = $app.getSessionMessage();
            new Notification("Focal", { body, icon: "" });
        }

        if ($app.play_ringtone) {
            const audio = new Audio(get_path("tone.mp3"));
            audio.play();
        }
    };

    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    const loadTimeValues = (duration) => {
        hours = Math.floor(duration / 60);
        minutes = Math.max(duration % 60, 0);
        seconds = 0;
    };

    const formatTime = (hours, minutes, seconds) => {
        let time = "";
        time += hours.toString().padStart(2, "0") + ":";
        time += minutes.toString().padStart(2, "0") + ":";
        time += seconds.toString().padStart(2, "0");
        return time;
    };
    let time = formatTime(0, 0, 0);

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
            loadTimeValues($app.getSessionDuration());
            signalSessionChange();
        }
    };

    let interval;
    let session = "Focus time!";
    const startTimer = () => {
        interval = setInterval(() => tickTimer(), 10);
    };
    const stopTimer = () => clearInterval(interval);

    let icon_src = paused ? get_path("play.svg") : get_path("pause.svg");
    const togglePlayback = () => {
        paused ? startTimer() : stopTimer();
        toggleMusicPlayback();
        paused = !paused;
        icon_src = paused ? get_path("play.svg") : get_path("pause.svg");
    };

    // Deep copy of the timer durations
    let prev_durations = JSON.parse(JSON.stringify($app.durations));
    onMount(() => {
        session = $app.gotoNextSession();
        loadTimeValues($app.getSessionDuration());
    });

    // Only change the timer when its values are changed in the settings
    // when we're paused and the value changed is relevant to our current session
    $: {
        let i = $app.current_session;
        let valid = i != -1 && paused;
        let value_changed = prev_durations[i] != $app.durations[i];
        if (valid && value_changed) {
            loadTimeValues($app.getSessionDuration());
            prev_durations = JSON.parse(JSON.stringify($app.durations));
        }
    }

    // Update the timer when its values change
    $: time = formatTime(hours, minutes, seconds);
</script>

<div class="container">
    <p>{session}</p>
    <h1>{time}</h1>
    <div class="controls">
        <button on:click={() => togglePlayback()}>
            <img src={icon_src} alt="play icon" />
        </button>
        <button on:click={() => (show_settings_popup = true)}>
            <img src={get_path("settings.svg")} alt="settings icon" />
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
