<script>
  import Pomodoro from "./Pomodoro.svelte";
  import TaskTree from "./TaskTree.svelte";
  import Settings from "./Settings.svelte";

  import { app, localstorageLoad, localstorageSave, setTheme } from "./state";
  import { onMount } from "svelte";

  let showSettingsPopup = false;

  onMount(() => {
    localstorageLoad();
    window.addEventListener("beforeunload", () => localstorageSave());
    if ($app.showNotification)
      Notification.requestPermission();
    setTheme(false);
   });
</script>

<Settings bind:showSettingsPopup />
<div class="left-side" style:background-color={$app.bg}>
  <Pomodoro bind:showSettingsPopup />
</div>
<div class="right-side" style:background-color={$app.bgShade}>
  <TaskTree />
</div>

<style>
  @font-face {
    font-family: "Arial Rounded";
    src: url("/ArialRounded.ttf");
  }

  :global(html) {
    width: 100%;
    height: 100%;
  }

  :global(body) {
    width: 100%;
    height: 100%;
    padding: 0px;
    margin: 0px;
    overflow: hidden;
    font-family: Arial, Helvetica, sans-serif;
  }

  @keyframes l1 { to { opacity: 0; } }

  .right-side {
    height: 100%;
    overflow-y: auto;
  }

  .right-side::-webkit-scrollbar-track { background: #81819c; }

  .right-side::-webkit-scrollbar-thumb { background: #2e2e38; }

  .right-side::-webkit-scrollbar-thumb:hover { background: #2e2e3880; }

  /*
  The timer is on the top, and the task tree is on the bottom
  in a mobile view
  */
  @media only screen and (max-width: 700px) {
    :global(body) {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .right-side { width: 100%; }
    .right-side::-webkit-scrollbar { width: 5px; }
  }

  /* The timer is on the left, and the task tree is on the right
  in a desktop view
  */
  @media only screen and (min-width: 700px) {
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

    .right-side::-webkit-scrollbar { width: 8px; }
  }
</style>
