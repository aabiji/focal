<script>
    export let value;
    let element;

    const handleInput = () => {
        const style = getComputedStyle(element);
        const padding = parseFloat(style.paddingBottom) * 3;
        element.style.height = "auto";
        element.style.height = `${element.scrollHeight - padding}px`;
    };
</script>

<textarea
    type="text"
    placeholder="Your Task"
    bind:value
    bind:this={element}
    on:input={() => handleInput()}
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
        padding: 5px;
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0);
        display: flex;
    }
</style>
