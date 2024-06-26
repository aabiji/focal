<script>
    import { task_tree } from "../lib/todo";
    import TaskComponent from "./TaskComponent.svelte";
</script>

<div class="container">
    <!--The task_tree is an object. Since objects in
        javascript are referenced, if we assign a field
        in the object to another variable and change that
        variable, the underlying object is changed also.
        We can leverage this and bind the task_tree store to
        our children, so that we (the parent) update when the
        children indirectly change the task tree-->
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