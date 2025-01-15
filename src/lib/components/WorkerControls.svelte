<script lang="ts">
    import { onMount } from "svelte";
    import MyWorker from "$lib/workers/path-finder?worker&inline";
    import type { WorkerResponse } from "$lib/model";
    import { shortestPath, vertexes, worker } from "$lib/store";
    import { calculatePath } from "$lib/controls";

    onMount(() => {
        return () => {
            $worker?.terminate();
        };
    });

    function initWorker() {
        if(!$worker) {
            $worker = new MyWorker();
            $worker.onmessage = onMessage;
        }
    }

    function startCalculation() {
        initWorker();
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
    <button on:click={startCalculation}>Start</button>
    <button on:click={stopWorker}>Stop</button>
    <button on:click={clearPath}>Clear Path</button>
</div>
