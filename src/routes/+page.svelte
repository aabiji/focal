<script>
    import TodoCard from "./TodoCard.svelte";
</script>

<div class="left-side">
    <p> Work session </p>
    <h1> 00:00:00 </h1>
    <div class="controls">
        <button>
            <img src="/assets/play.svg" alt="play icon">
        </button>
        <button>
            <img src="/assets/settings.svg" alt="settings icon">
        </button>
    </div>
</div>

<div class="right-side">
    <TodoCard />
</div>

<style>
    :global(body) {
        width: 100%;
        height: 100%;
        padding: 0px;
        margin: 0px;

        background: linear-gradient(to right, #e55d87, #5fc3e4);
        background-repeat: no-repeat;
        background-attachment: fixed;

        font-family: Arial, Helvetica, sans-serif;
    }

    .left-side {
        width: 50%;
        height: 100%;
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .left-side h1 {
        font-size: 50px;
        color: white;
    }

    .left-side p {
        margin-bottom: -20px;
        font-size: 20px;
        color: white;
    }

    .controls button {
        cursor: pointer;
        background: none;
        outline: none;
        border: none;
    }

    .controls button img {
        width: 20px;
        height: 20px;
    }

    .right-side {
        left: 50%;
        width: 48.5%;
        height: 98.5%;
        padding: 5px 10px;
        position: absolute;
        background-color: rgba(255, 255, 255, 0.1);
    }
</style>