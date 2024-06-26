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
        let new_task = new Task("test", false, task);
        task.children = [...task.children, new_task];
    };

    const removeTask = () => {
        let index = task.parent.children.indexOf(task);
        let before = task.parent.children.slice(0, index);
        let after = task.parent.children.slice(index + 1,);
        task.parent.children = [...before, ...after];
    }
</script>

<div class="container">
    <div class="info">
        <div class="text" on:keydown={(event) => toggleKeyboardHandler(event)}
             on:click={() => toggleStatus()} role="button" tabindex="0">
            <input style={task.done ? "text-decoration: line-through;" : ""}
                   type="text" placeholder="Your Task" bind:value={task.name}>
        </div>

        <div class="controls">
            <button class="add" on:click={() => addSubTask()}> + </button>
            {#if !task.is_root}
                <button class="remove" on:click={() => removeTask()}> - </button>
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
        font-size: 17px;
    }

    .info {
        display: flex;
        cursor: pointer;
        margin-bottom: 10px;
        align-items: center;
        border-radius: 5px;
        padding-left: 10px;
        padding-right: 10px;
        background-color: rgba(255, 255, 255, 0.7);
    }

    .text {
        width: 80%;
        overflow-wrap: break-word;
    }

    .children {
        margin-left: 25px;
    }

    .add { color: green; }
    .remove { color: red; }
    .controls {
        margin-left: auto;
    }

    input {
        border: none;
        outline: none;
        background-color: rgba(0, 0, 0, 0);
        font-size: 17px;
    }

    button {
        border: none;
        outline: none;
        font-size: 25px;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0);
    }
</style>