<script>
    import Pomodoro from "./Pomodoro.svelte";
    import TaskTree from "./TaskTree.svelte";
    import Settings from "./Settings.svelte";

    import { app } from "./state";
    import { onMount } from "svelte";

    let youtube_player;
    let player_ready = false;
    let player_id = "youtube-player";
    let video_id = "jfKfPfyJRdk"; // Lofi Girl livestream
    const on_video_ready = () => (player_ready = true);
    const load_video = () => {
        youtube_player = new YT.Player(player_id, {
            height: "0",
            width: "0",
            videoId: video_id,
            playerVars: { autoplay: 0, loop: 1 },
            events: { onReady: on_video_ready },
        });
    };

    let show_settings_popup = false;
    onMount(() => {
        $app.loadFromLocalstorage(window.localStorage);
        // Save in localstorage on reload or close
        window.addEventListener("beforeunload", () => {
            localStorage.setItem("data", JSON.stringify($app));
        });

        if (window.YT) {
            load_video();
        } else {
            window.onYouTubeIframeAPIReady = load_video;
        }

        if ($app.show_notification) {
            Notification.requestPermission();
        }
    });
</script>

<!---Embedded youtube player-->
<svelte:head>
    <script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>
<div id={player_id} class="yt-player"></div>

{#if player_ready}
    <Settings bind:show_settings_popup />
    <div class="left-side">
        <Pomodoro bind:show_settings_popup bind:youtube_player />
    </div>
    <div class="right-side"><TaskTree /></div>
{:else}
    <div class="loading-animation"></div>
{/if}

<style>
    @font-face {
        font-family: "Arial Rounded";
        src: url("/ArialRounded.ttf");
    }

    :global(body) {
        width: 100%;
        height: 100%;
        padding: 0px;
        margin: 0px;
        overflow: hidden;
        background: linear-gradient(to right, #67b26f, #4ca2cd);
        background-repeat: no-repeat;
        background-attachment: fixed;
        font-family: Arial, Helvetica, sans-serif;
    }

    .yt-player {
        display: none;
    }

    .loading-animation {
        top: 45%;
        left: 35%;
        color: white;
        font-weight: bold;
        font-family: "Arial Rounded";
        font-size: 50px;
        animation: l1 1s linear infinite alternate;
        position: absolute;
    }

    .loading-animation:before {
        content: "Loading Focal...";
    }

    @keyframes l1 {
        to {
            opacity: 0;
        }
    }

    .left-side {
        position: absolute;
        width: 50%;
        height: 100%;
    }

    .right-side {
        left: 50%;
        width: 50%;
        height: 100%;
        position: absolute;
        background-color: rgba(255, 255, 255, 0.1);
    }
</style>
