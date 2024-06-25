<script lang="ts">
    import type { Task } from "../lib/todo";
    export let task: Task = {name: "", children: [], done: false};

    let text_style = "";
    const toggleStatus = () => {
        text_style = task.done ? "done" : "";
        task.done = !task.done;
    };
    const toggleKeyboardHandler = (event: any) => {
        if (event.key == "Enter" || event.key == " ") {
            toggleStatus();
        }
    };
</script>

<div class="container" role="button" tabindex="0"
     on:click={() => toggleStatus()}
     on:keydown={(event) => toggleKeyboardHandler(event)}>
    <div class="info">
        <div class="text">
            <p class={text_style}> {task.name} </p>
        </div>

        <div class="controls">
            <button class="add"> + </button>
            <button class="remove"> - </button>
        </div>
    </div>

    <div class="children">
        {#each task.children as child_task}
            <svelte:self task={child_task}/>
        {/each}
    </div>
</div>

<style>
    .container {
        width: 100%;
        height: fit-content;
        font-size: 16px;
    }

    .info {
        display: flex;
        cursor: pointer;
        margin-bottom: 10px;
        align-items: center;
        border-radius: 5px;
        padding-left: 10px;
        background-color: rgba(255, 255, 255, 0.7);
    }

    .text {
        width: 80%;
        overflow-wrap: break-word;
    }

    .done {
        text-decoration: line-through;
    }

    .children {
        margin-left: 25px;
    }

    .add { color: green; }
    .remove { color: red; }
    .controls {
        margin-left: auto;
    }

    button {
        border: none;
        outline: none;
        font-size: 25px;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0);
    }
</style>