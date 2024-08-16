<script>
    import Pomodoro from "./Pomodoro.svelte";
    import TaskTree from "./TaskTree.svelte";
    import Settings from "./Settings.svelte";

    import { app } from "./app";
    import { onMount } from "svelte";

    let show_settings_popup = false;
    let player_ready = false;
    const player_id = "youtube-player";

    onMount(() => {
        $app.loadFromLocalstorage(window.localStorage);

        // Save in localstorage on reload or close
        window.addEventListener("beforeunload", () => {
            localStorage.setItem("data", JSON.stringify($app));
        });

        load_player();
        if ($app.show_notification) {
            Notification.requestPermission();
        }
    });

    const on_video_ready = () => (player_ready = true);
    const load_video = () => {
        player_ready = false;
        $app.music.youtube_player = new YT.Player(player_id, {
            height: "0",
            width: "0",
            videoId: $app.music.genre,
            playerVars: { autoplay: 0, loop: 1 },
            events: { onReady: on_video_ready },
        });
    };

    const load_player = () => {
        if (window.YT) {
            load_video();
        } else {
            window.onYouTubeIframeAPIReady = load_video;
        }
    };

    // Reload music playback
    $: {
        if ($app.music.reload) {
            $app.music.stop();
            if ($app.play_music) {
                $app.music.load();
            }
        }
        $app.music.reload = false;
    }
</script>

<!---Embedded youtube player-->
<svelte:head>
    <script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>
<div id={player_id} class="yt-player"></div>

<!---UI-->
{#if player_ready}
    <Settings bind:show_settings_popup />
    <div class="left-side">
        <Pomodoro bind:show_settings_popup />
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
        font-family: Arial, Helvetica, sans-serif;
        background: linear-gradient(to right, #67b26f, #4ca2cd);
        background-repeat: no-repeat;
        background-attachment: fixed;
    }

    .yt-player {
        display: none;
    }

    .loading-animation {
        /* Center horizantally */
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;

        top: 45%;
        color: white;
        width: fit-content;
        font-weight: bold;
        font-family: "Arial Rounded";
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

    .right-side {
        height: 100%;
        overflow-y: auto;
        background-color: rgba(255, 255, 255, 0.1);
    }

    .right-side::-webkit-scrollbar-track {
        background: #00000000;
    }

    .right-side::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 1);
    }

    .right-side::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.9);
    }

    /*
       The timer is on the top, and the task tree is on the bottom
      in a mobile view
     */
    @media only screen and (max-width: 550px) {
        :global(body) {
            display: flex;
            flex-direction: column;
            height: 100vh;
            overflow: hidden;
        }

        .right-side {
            width: 100%;
            margin-top: 25px;
        }

        .loading-animation {
            font-size: 30px;
        }

        .right-side::-webkit-scrollbar {
            width: 5px;
        }
    }

    /* The timer is on the left, and the task tree is on the right
       in a desktop view
    */
    @media only screen and (min-width: 550px) {
        .left-side {
            position: absolute;
            width: 50%;
            height: 100%;
        }

        .right-side {
            left: 50%;
            width: 50%;
            position: absolute;
        }

        .loading-animation {
            font-size: 40px;
        }

        .right-side::-webkit-scrollbar {
            width: 8px;
        }
    }
</style>
