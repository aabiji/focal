<script>
    import Pomodoro from "./Pomodoro.svelte";
    import TodoList from "./TodoList.svelte";
    import Settings from "./Settings.svelte";
    import { app } from "../lib/state";
    import { onMount } from "svelte";

    let show_settings_popup = false;
    onMount(() => {
        $app.loadFromLocalstorage(window.localStorage);

        // Save in localstorage on reload or close
        window.addEventListener("beforeunload", (event) => {
            localStorage.setItem("data", JSON.stringify($app));
        });
    });
</script>

<Settings bind:show_settings_popup />
<div class="left-side">
    <Pomodoro bind:show_settings_popup />
</div>
<div class="right-side"><TodoList /></div>

<style>
    :global(body) {
        width: 100%;
        height: 100%;
        padding: 0px;
        margin: 0px;
        overflow: hidden;
        background: linear-gradient(to right, #e55d87, #5fc3e4);
        background-repeat: no-repeat;
        background-attachment: fixed;
        font-family: Arial, Helvetica, sans-serif;
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