<script lang="ts">
    import { movePoint, updateCanvas } from "$lib/controls";
    import type { Coords } from "$lib/model";
    import { createMouseController } from "$lib/mouseController";
    import { selectedEntity, selectedType, setCanvas, startIndex } from "$lib/store";
    import { onMount } from "svelte";
    import Controls from "./Controls.svelte";


    let canvas: HTMLCanvasElement;
    const mouseController = createMouseController();

    function onResize() {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;

        updateCanvas();
    }

    function onMouseMove(delta: Coords) {
        switch($selectedType) {
            case 0:
                movePoint($selectedEntity, delta);
                break;
        }
    }

    onMount(() => {
        mouseController.init(canvas);
        mouseController.deltaPosition.subscribe(onMouseMove);

        // store canvas globally
        setCanvas(canvas);
        onResize();

        return () => {
            mouseController.destroy();
        }
    });
</script>

<div class="controls">
    <Controls />
</div>

<canvas bind:this={canvas}></canvas>
<svelte:window on:resize={onResize} />

<style>
    canvas {
    display: block;
    }
    .controls {
        position: absolute;
        top: 0;
        right: 0;
    }
</style>