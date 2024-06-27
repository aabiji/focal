<script>
    import Pomodoro from "./Pomodoro.svelte";
    import TodoList from "./TodoList.svelte";
    import Settings from "./Settings.svelte";
    import { app } from "../lib/state";
    import { onMount } from "svelte";

    // TODO: loading animation while waiting for player to load
    let youtube_player;
    let player_id = "youtube-player";
    let playlist_id = "PL_TkPSb3IjrVI5j26eIR_E7DAUqM2KE3_";
    const load_video = () => {
        youtube_player = new YT.Player(player_id, {
            height: "200",
            width: "200",
            videoId: "jfKfPfyJRdk",
            playerVars: {
                "autoplay": 0,
                "listType": "playlist",
                "list": playlist_id
            },
        });
    };

    let show_settings_popup = false;
    onMount(() => {
        $app.loadFromLocalstorage(window.localStorage);

        // Save in localstorage on reload or close
        window.addEventListener("beforeunload", (event) => {
            localStorage.setItem("data", JSON.stringify($app));
        });

        if (window.YT) {
            load_video();
        } else {
            window.onYouTubeIframeAPIReady = load_video;
        }

        Notification.requestPermission();
    });
</script>

<svelte:head>
    <script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>
<div id={player_id} class="yt-player"></div>

<Settings bind:show_settings_popup />
<div class="left-side">
    <Pomodoro bind:show_settings_popup bind:youtube_player />
</div>
<div class="right-side"><TodoList /></div>

<style>
    :global(body) {
        width: 100%;
        height: 100%;
        padding: 0px;
        margin: 0px;
        overflow: hidden;
        background: linear-gradient(to right, #67B26F, #4ca2cd);
        background-repeat: no-repeat;
        background-attachment: fixed;
        font-family: Arial, Helvetica, sans-serif;
    }

    .yt-player {
        display: none;
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