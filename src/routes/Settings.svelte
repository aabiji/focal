<script>
    import { app, get_path } from "./state";
    export let show_settings_popup;
</script>

{#if show_settings_popup}
    <div class="backdrop">
        <dialog open>
            <button
                class="close"
                on:click={() => (show_settings_popup = false)}
            >
                <img src={get_path("close.svg")} alt="Close icon" />
            </button>

            <div>
                <label>
                    <input type="checkbox" bind:checked={$app.play_ringtone} />
                    Ring on session switch
                </label>
                <label>
                    <input type="checkbox" bind:checked={$app.play_ringtone} />
                    Notify on session switch
                </label>
                <label>
                    <input type="checkbox" bind:checked={$app.play_music} />
                    Play background music
                </label>
            </div>

            <h3>Durations in minutes</h3>
            <div class="durations">
                <div class="duration">
                    <p>Work session</p>
                    <input type="number" bind:value={$app.work_duration} />
                </div>
                <div class="duration">
                    <p>Short break</p>
                    <input
                        type="number"
                        bind:value={$app.short_break_duration}
                    />
                </div>
                <div class="duration">
                    <p>Long break</p>
                    <input
                        type="number"
                        bind:value={$app.long_break_duration}
                    />
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
        height: fit-content;
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

    .close {
        border: none;
        outline: none;
        cursor: pointer;
        float: right;
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
