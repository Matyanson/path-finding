<script lang="ts">
    import { movePoint, updateCanvas } from "$lib/controls";
    import type { Coords } from "$lib/model";
    import { createMouseController } from "$lib/mouseController";
    import { setCanvas, startIndex } from "$lib/store";
    import { onMount } from "svelte";


    let canvas: HTMLCanvasElement;
    const mouseController = createMouseController();

    function onResize() {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;

        updateCanvas();
    }

    function onMouseMove(delta: Coords) {
        movePoint(0, delta);
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

<canvas bind:this={canvas}></canvas>
<svelte:window on:resize={onResize} />

<style>
     canvas {
        display: block;
     }
</style>