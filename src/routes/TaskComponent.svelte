<script>
    import { Task } from "../lib/todo";

    export let task;

    const toggleStatus = () => {
        if (!task.is_root) {
            task.done = !task.done;
            for (let child of task.children) {
                child.done = !child.done;
            }
        }
    };

    const toggleKeyboardHandler = (event) => {
        if (event.key == "Enter" || event.key == " ") {
            toggleStatus();
        }
    };

    const addSubTask = () => {
        let new_task = new Task("test", false);
        task.children = [...task.children, new_task];
    };
</script>

<div class="container">
    <div class="info">
        <div class="text" on:keydown={(event) => toggleKeyboardHandler(event)}
             on:click={() => toggleStatus()} role="button" tabindex="0">
            <p class={text_style}> {task.name} </p>
        </div>

        <div class="controls">
            <button class="add" on:click={() => addSubTask()}> + </button>
            {#if !task.is_root}
                <button class="remove"> - </button>
            {/if}
        </div>
    </div>

    <div class="children">
        {#each task.children as child_task}
            <svelte:self bind:task={child_task}/>
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