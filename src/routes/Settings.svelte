<script>
  import { app, setTheme } from "./state";
  import { Icon } from "svelte-icons-pack";
  import { FiX } from "svelte-icons-pack/fi";
  export let showSettingsPopup;

  // in order to buffer changes
  let work = $app.workMinutes;
  let short = $app.shortBreakMinutes;
  let long = $app.longBreakMinutes;
  const close = () => {
    showSettingsPopup = false;
    $app.workMinutes = work;
    $app.shortBreakMinutes = short;
    $app.longBreakMinutes = long;
  }
</script>

{#if showSettingsPopup}
<div class="backdrop">
  <dialog open style:color={$app.fg}
      style:background-color={$app.darkMode ? $app.bgShade : $app.bg}>
    <button class="close" on:click={close}>
      <Icon src={FiX} color={`${$app.fgShade}`} size="26" />
    </button>

    <div>
      <label>
        <input type="checkbox" on:change={() => setTheme(true)} />
        Dark mode
      </label>
      <label>
        <input type="checkbox" bind:checked={$app.playRingtone} />
        Ring on session switch
      </label>
      <label>
        <input type="checkbox" bind:checked={$app.showNotification} />
        Notify on session switch
      </label>
    </div>

    <h3>Durations in minutes</h3>
    <div class="durations">
      <div class="duration">
        <p>Work session</p>
        <input type="number" bind:value={work}
          style:background-color={$app.bg} style:color={$app.fg} />
      </div>
      <div class="duration">
        <p>Short break</p>
        <input type="number" bind:value={short}
          style:background-color={$app.bg} style:color={$app.fg} />
      </div>
      <div class="duration">
        <p>Long break</p>
        <input type="number" bind:value={long}
          style:background-color={$app.bg} style:color={$app.fg} />
      </div>
    </div>
  </dialog>
</div>
{/if}

<style>
  @media only screen and (max-width: 550px) {
    dialog {
      top: 50%;
      border: none;
      width: 80%;
      height: fit-content;
      margin: 0 auto;
      border-radius: 10px;
      transform: translateY(-80%);
    }
  }

  @media only screen and (min-width: 550px) {
    dialog {
      top: 50%;
      border: none;
      width: 30%;
      height: fit-content;
      margin: 0 auto;
      border-radius: 10px;
      transform: translateY(-80%);
    }
  }

  .backdrop {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .close {
    border: none;
    outline: none;
    cursor: pointer;
    float: right;
    background-color: rgba(0, 0, 0, 0);
  }

  .durations {
    display: flex;
    flex-direction: row;
    margin-top: -15px;
  }

  .duration {
    width: 60px;
    text-align: center;
    margin-right: 15px;
  }

  label {
    margin-top: 10px;
    font-size: 16px;
    display: block;
  }

  input {
    border: none;
    outline: none;
    border-bottom: 1px solid #67b26f;
  }

  input:active,
  input:hover {
    background-color: #fcfcfc;
  }

  input[type="number"] {
    width: 50px;
    outline: none;
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    margin-right: 3px;
    cursor: pointer;
    vertical-align: middle;
    position: relative;
    bottom: 1px;
  }
</style>
