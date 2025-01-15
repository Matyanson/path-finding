<script lang="ts">
    import { onMount } from "svelte";
    import MyWorker from "$lib/workers/path-finder?worker&inline";
    import type { WorkerRequest, WorkerResponse } from "$lib/model";
    import { dotSpacing, finishIndex, points, startIndex } from "$lib/store";

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
        const request: WorkerRequest = {
            startPoint: $points[$startIndex],
            endPoint: $points[$finishIndex],
            dotSpacing: $dotSpacing
        };
        worker.postMessage(request);
    }

    function resetWorker() {
        worker?.terminate();
        worker = new MyWorker();
    }

    function onMessage(event: MessageEvent) {
        const result = event.data as WorkerResponse;

        console.log(result);
    }
</script>

<div>
    <button on:click={startWorker}>Start Calculation</button>
    <button on:click={resetWorker}>Reset</button>
</div>
