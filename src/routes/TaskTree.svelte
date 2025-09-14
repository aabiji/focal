<script>
  import { app } from "./app";
  import Task from "./Task.svelte";
</script>

<div class="container">
  <!--The taskTree is an object. Since objects in
  javascript are referenced, if we assign a field
  in the object to another variable and change that
  variable, the underlying object is changed also.
  We can leverage this and bind the taskTree store to
  our children, so that we (the parent) update when the
  children indirectly change the task tree-->
  <Task bind:task={$app.taskTree} />
</div>

<style>
  .container {
    max-width: 100%;
    padding: 10px 10px 0px 10px;
    overflow: hidden;
  }
</style>
