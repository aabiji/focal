<script lang="ts">
    import type { Task } from "../lib/todo";
    import TaskComponent from "./TaskComponent.svelte";

    const tasks: Task[] = [
        {
            name: "Task #1",
            done: false,
            children: [
                {
                    name: "Sub task #1",
                    done: false,
                    children: [
                        {
                            name: "Sub sub task #1",
                            done: false,
                            children: [],
                        }
                    ]
                }
            ]
        },
        {
            name: "Task #2",
            children: [],
            done: false,
        },
        {
            name: "Task #3",
            children: [],
            done: false,
        },
    ];
</script>

<div class="container">
    {#each tasks as task}
        <TaskComponent task={task}/>
    {/each}
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