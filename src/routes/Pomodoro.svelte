<script>
    import { app } from "./state";

    export let show_settings_popup;
    export let youtube_player;

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
            new Notification("Focal", { body, icon: "" } );
        }

        if ($app.play_music) {
            const audio = new Audio("/tone.mp3");
            audio.play();
        }
    }

    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    const loadTimeValues = () => {
        seconds = 59;
        let duration = $app.getSessionDuration();
        hours   = Math.round(duration / 60);
        let x = hours * 60 - duration - 1;
        minutes = hours > 0 ? x : duration - 1;
    }

    let time = "00:00:00";
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
            loadTimeValues();
            signalSessionChange();
        }

        time = "";
        time += hours.toString().padStart(2, '0') + ":";
        time += minutes.toString().padStart(2, '0') + ":";
        time += seconds.toString().padStart(2, '0');
    }

    let interval;
    let session = "Focus time!";
    const startTimer = () => {
        if ($app.current_session == -1) {
            session = $app.gotoNextSession();
            loadTimeValues();
        }
        interval = setInterval(() => tickTimer(), 1000);
    };
    const stopTimer = () => clearInterval(interval);

    let paused = true;
    let icon_src = `/${paused ? "play.svg" : "pause.svg"}`;
    const togglePlayback = () => {
        paused ? startTimer() : stopTimer();
        toggleMusicPlayback();
        paused = !paused;
        icon_src = `/${paused ? "play.svg" : "pause.svg"}`;
    };
</script>

<div class="container">
    <p> {session} </p>
    <h1> {time} </h1>
    <div class="controls">
        <button on:click={() => togglePlayback()}>
            <img src={icon_src} alt="play icon">
        </button>
        <button on:click={() => show_settings_popup = true}>
            <img src="settings.svg" alt="settings icon">
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