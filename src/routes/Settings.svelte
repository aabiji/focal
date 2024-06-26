<script>
    export let show_settings_popup;
</script>

{#if show_settings_popup}
<div class="backdrop">
    <dialog open>
        <div class="header">
            <h1> Settings </h1>
            <button class="close"
            on:click={() => show_settings_popup = false}>
                <img src="/close.svg" alt="Close icon">
            </button>
        </div>

        <h3> Session durations (minutes) </h3>
        <div class="durations">
            <div class="duration">
                <p>Work</p>
                <input type="number" value="0">
            </div>
            <div class="duration">
                <p>Long break</p>
                <input type="number" value="0">
            </div>
            <div class="duration">
                <p>Short break</p>
                <input type="number" value="0">
            </div>
        </div>
    </dialog>
</div>
{/if}

<style>
    dialog {
        top: 50%;
        border: none;
        width: 30%;
        height: 30%;
        margin: 0 auto;
        border-radius: 10px;
        transform: translateY(-80%);
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

    .header {
        display: flex;
        align-items: center;
    }

    .close {
        margin-left: auto;
        cursor: pointer;
        border: none;
        outline: none;
        background-color: rgba(0, 0, 0, 0);
    }

    .close img {
        width: 25px;
        height: 25px;
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

    input[type=number] {
        width: 50px;
        outline: none;
    }
</style>