<script>
  import { onMount } from "svelte";

  export let newlyCreated;
  export let value;
  let element;

  const autoresize = () => {
    const style = getComputedStyle(element);
    const padding = parseFloat(style.padding) * 2;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight - padding}px`;
  };

  onMount(() => {
    autoresize();
    if (newlyCreated) {
        newlyCreated = false;
        element.focus();
    }
  });
</script>

<textarea
  placeholder="Your Task"
  spellcheck="false"
  autocorrect
  rows="1"
  bind:value
  bind:this={element}
  on:input={() => autoresize()}
/>

<style>
  textarea {
    border: none;
    outline: none;
    font-size: 17px;
    resize: none;
    width: 100%;
    font-family: sans-serif;
    line-height: normal;
    overflow: hidden;
    margin-top: 12px;
    padding: 8px;
    background-color: rgba(0, 0, 0, 0);
  }
</style>
