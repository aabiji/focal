<script>
    import { Task, app } from "../lib/state";
    import Checkbox from "./Checkbox.svelte";

    export let task;
    const triggerUIRefresh = () => $app.task_tree = {...$app.task_tree};

    const toggleStatus = () => {
        task.done = !task.done;
        for (let child of task.children) {
            child.done = !child.done;
        }
        triggerUIRefresh();
    };

    const addSubTask = () => {
        task.children.push(new Task("New task", false, task));
        triggerUIRefresh();
    };

    // Walk the tree to find the parent, then
    // remove the task from the parent's list of tasks
    const removeFromParent = (node, id, task) => {
        if (id == node.id) {
            let index = node.children.indexOf(task);
            let before = node.children.slice(0, index);
            let after = node.children.slice(index + 1);
            node.children = [...before, ...after];
            triggerUIRefresh();
        }

        for (let i = 0; i < node.children.length; i++) {
            removeFromParent(node.children[i], id, task);
        }
    };

    const removeTask = () => removeFromParent($app.task_tree, task.parent, task);

    const toggleKeyboardHandler = (event) => {
        if (event.key == "Enter" || event.key == " ") {
            toggleStatus();
        }
    };
</script>

<div class="container">
    <div class="task">
        <div class="box" on:keydown={(event) => toggleKeyboardHandler(event)}
            on:click={() => toggleStatus()} role="button" tabindex="0">
            <Checkbox done={task.done}/>
        </div>

        <div class="text">
            {#if task.is_root}
                <h4> {task.name} </h4>
            {:else}
                <input type="text" placeholder="Your Task" bind:value={task.name}>
            {/if}
        </div>

        <div class="controls">
            &nbsp; <!--So that the div has a width with no elements -->
            <button class="add" on:click={() => addSubTask()}>
                <img src="/plus.svg" alt="Add icon">
            </button>
            {#if !task.is_root}
                <button class="remove" on:click={() => removeTask()}>
                    <img src="/trash.svg" alt="Trash icon">
                </button>
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

    .task {
        height: 35px;
        display: flex;
        cursor: pointer;
        margin-bottom: 10px;
        align-items: center;
        border-radius: 5px;
        padding-left: 10px;
        padding-right: 10px;
        background-color: rgba(255, 255, 255, 0.85);
    }

    .text {
        width: 80%;
        overflow-wrap: break-word;
    }

    .children {
        margin-left: 25px;
    }

    .box {
        margin-right: 10px;
    }

    .add {
        color: white;
        margin-left: 10px;
        float: right;
    }

    .remove {
        float: right;
        width: 30px;
        color: white;
    }

    .controls {
        margin-left: auto;
        min-width: 25%;
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
        margin-right: -10px;
        background-color: rgba(0, 0, 0, 0);
    }

    img {
        width: 22px;
        height: 22px;
        margin-top: 8px;
    }
</style>