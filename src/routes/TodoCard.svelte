
<div class="container">
    <div class="info">
        <p> Your tasks </p>
        <div class="controls">
            <button class="add"> + </button>
            <button class="remove"> - </button>
        </div>
    </div>
</div>

<style>
    .container {
        width: 98%;
        height: fit-content;
        padding: 2px 10px;
        font-size: 16px;
        margin-bottom: 10px;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 10px;
        cursor: pointer;
    }

    .info {
        display: flex;
        align-items: center;
    }

    .controls {
        margin-left: auto;
    }

    .add {
        color: green;
    }

    .remove {
        color: red;
    }

    button {
        border: none;
        outline: none;
        background-color: rgba(0, 0, 0, 0);
        font-size: 25px;
    }
</style>