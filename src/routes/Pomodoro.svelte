<script>
    let state = -1;
    let break_count = 0;
    let long_break_freq = 4;
    let session = "Do something amazing!";
    const changeSession = () => {
        state = (state + 1) % 3;
        if (state == 0) {
            session = "Work";
        } else if (state == 1) {
            break_count += 1;
            session = "Short Break";
        } else {
            if (break_count < long_break_freq) {
                changeSession();
                return;
            }
            session = "Long Break";
            break_count = 0;
        }
    };

    let seconds = 59;
    let minutes = 0;
    let hours   = 0;
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
            changeSession();
            seconds = 59;
            minutes = 0;
            hours = 0;
        }

        time = "";
        time += hours.toString().padStart(2, '0') + ":";
        time += minutes.toString().padStart(2, '0') + ":";
        time += seconds.toString().padStart(2, '0');
    }

    let interval;
    const startTimer = () => {
        if (state == -1) changeSession();
        interval = setInterval(() => tickTimer(), 1000);
    };
    const stopTimer = () => clearInterval(interval);

    let paused = true;
    let icon_src = `/${paused ? "play.svg" : "pause.svg"}`;
    const togglePlayback = () => {
        if (paused) {
            paused = false;
            startTimer();
        } else {
            paused = true;
            stopTimer();
        }
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
        <button>
            <img src="/settings.svg" alt="settings icon">
        </button>
    </div>
</div>

<style>
    @font-face {
        font-family: "Arial Rounded";
        src: url("/ArialRounded.ttf");
    }

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
    }
</style>