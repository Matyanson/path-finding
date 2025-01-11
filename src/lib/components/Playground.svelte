<script lang="ts">
    import { drawCanvas } from "$lib/controls";
    import { canvasState, setCanvas } from "$lib/store";
    import type { Coords } from "$lib/model";
    import { createMouseController } from "$lib/mouseController";
    import { setCanvas } from "$lib/store";
    import { onMount } from "svelte";


    let canvas: HTMLCanvasElement;
    const mouseController = createMouseController();

    function onResize() {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;

        // console.log(canvas.width, canvas.height);
        drawCanvas();
    }

    onMount(() => {
        mouseController.init(canvas);

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