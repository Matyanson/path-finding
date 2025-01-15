<script lang="ts">
    import { onMount } from "svelte";
    import MyWorker from "$lib/workers/path-finder?worker&inline";
    import type { WorkerRequest, WorkerResponse } from "$lib/model";
    import { dotSpacing, finishIndex, points, shortestPath, startIndex, vertexes, worker } from "$lib/store";
    import { calculatePath } from "$lib/controls";

    onMount(() => {
        // Initialize the worker
        startWorker();

        return () => {
            $worker?.terminate();
        };
    });

    function startWorker() {
        if(!$worker) {
            $worker = new MyWorker();
            $worker.onmessage = onMessage;
        }
        calculatePath();
    }

    function stopWorker() {
        $worker?.terminate();
        worker.set(null);
    }

    function onMessage(event: MessageEvent) {
        const result = event.data as WorkerResponse;

        shortestPath.set(result.shortestPath);
        vertexes.set(result.allEdges);
    }

    function clearPath() {
        shortestPath.set([]);
        vertexes.set([]);
    }
</script>

<div>
    <button on:click={startWorker}>Start Calculation</button>
    <button on:click={stopWorker}>Stop Calculation</button>
    <button on:click={clearPath}>Clear Path</button>
</div>
