<script lang="ts">
    import { onMount } from "svelte";
    import MyWorker from "$lib/workers/path-finder?worker&inline";

    let result: string | null = null;
    let inputValue = 0; // Start with 0
    let worker: Worker;

    onMount(() => {
        // Initialize the worker
        worker = new MyWorker();
        worker.onmessage = onMessage;

        return () => {
            worker.terminate();
        };
    });

    function startWorker() {
        if(!worker) return;
        worker.postMessage(inputValue);
        inputValue++;
    }

    function resetWorker() {
        worker?.terminate();
        worker = new MyWorker();
    }

    function onMessage(event: MessageEvent) {
        result = event.data;
    }
</script>

<div>
    <button on:click={startWorker}>Start Calculation</button>
    <button on:click={resetWorker}>Reset</button>

    {#if result}
        <p>Result: {result}</p>
    {/if}
</div>
