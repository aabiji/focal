<script>
  import { Icon } from "svelte-icons-pack";
  import { BiX, BiPlus } from "svelte-icons-pack/bi";
  import { app, Task } from "./state";
  import Checkbox from "./Checkbox.svelte";
  import Input from "./Input.svelte";

  export let task;
  // Refresh when the task tree changes
  const triggerUIRefresh = () => ($app.taskTree = { ...$app.taskTree });

  const toggleStatus = () => {
    const recurse = (t, done) => {
      t.done = done;
      for (let child of t.children) {
        child.done = t.done;
        recurse(child, done);
      }
    };
    recurse(task, !task.done);
    triggerUIRefresh();
  };

  const addSubTask = () => {
    task.children.push(new Task("", false, task, true));
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

  const removeTask = () => removeFromParent($app.taskTree, task.parent, task);

  const toggleKeyboardHandler = (event) => {
    if (event.key == "Enter" || event.key == " ") {
      toggleStatus();
    }
  };
</script>

<div class="container">
  <div class="task" style:background-color={$app.bg}>
    <div
    class="box"
    on:keydown={(event) => toggleKeyboardHandler(event)}
    on:click={() => toggleStatus()}
    role="button"
    tabindex="0">
    <Checkbox done={task.done} />
  </div>
  <div class="text">
  {#if task.isRoot}
    <p style:color={$app.fg}>{task.name}</p>
    {:else}
    <Input
      bind:value={task.name}
      bind:newlyCreated={task.newlyCreated}
      />
    {/if}
  </div>
  <div class="controls">
    {#if !task.isRoot}
      <button class="remove" on:click={() => removeTask()}>
        <Icon src={BiX} color="#ff0000" size="24" />
      </button>
    {/if}
    <button class="add" on:click={() => addSubTask()}>
      <Icon src={BiPlus} color={`${$app.fgShade}`} size="32" />
    </button>
  </div>
  </div>
  <div class="children">
      {#each task.children as childTask}
          <svelte:self bind:task={childTask} />
          {/each}
  </div>
</div>

<style>
  .container {
    width: 100%;
    font-size: 17px;
  }

  .task {
    display: flex;
    margin-bottom: 10px;
    align-items: center;
    border-radius: 5px;
    padding-left: 10px;
    padding-right: 10px;
    height: fit-content;
    align-items: center;
  }

  .text {
    width: 80%;
    overflow-wrap: break-word;
    height: fit-content;
    vertical-align: middle;
    margin-top: -10px;
  }

  @media only screen and (max-width: 550px) {
    .children { margin-left: 18px; }
  }

  @media only screen and (min-width: 550px) {
    .children {
      margin-left: 25px;
    }
  }

  .box {
    margin-right: 10px;
    margin-top: -8px;
  }

  .controls {
    margin-left: auto;
    min-width: 25%;
    flex-direction: "row";
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  button {
    border: none;
    outline: none;
    font-size: 25px;
    cursor: pointer;
    margin-right: -10px;
    background-color: rgba(0, 0, 0, 0);
  }
</style>
