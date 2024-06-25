<script lang="ts">
    let paused = false;
    let icon_src = "/play.svg";
    const togglePlayback = () => {
        icon_src = `/${paused ? "play.svg" : "pause.svg"}`;
        paused = !paused;
    };
</script>

<div class="container">
    <p> Work session </p>
    <h1> 00:00:00 </h1>
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