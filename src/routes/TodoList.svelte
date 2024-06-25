<script>
    import { setContext } from "svelte";
    import { RootTask } from "../lib/todo";
    import TaskComponent from "./TaskComponent.svelte";

    import { writable } from "svelte/store";

    const task_tree = writable(RootTask);
    $: console.log(task_tree); // TODO: update ui
</script>

<div class="container">
    <TaskComponent bind:task={$task_tree}/>
</div>

<style>
    .container {
        padding: 10px 10px;
        overflow-y: scroll;
        max-height: 100%;
        max-width: 100%;
        overflow-x: hidden;
    }

    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        background: #00000000;
    }

    ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 1);
    }

    ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.9);
    }
</style>