<script lang="ts">
    import { drawCanvas } from "$lib/controls";
    import { canvasState, setCanvas } from "$lib/store";
    import { onMount } from "svelte";


    let canvas: HTMLCanvasElement;

    function onResize() {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;

        // console.log(canvas.width, canvas.height);
        drawCanvas();
    }

    onMount(() => {
        // store canvas globally
        setCanvas(canvas);
        onResize();
    });

</script>

<canvas bind:this={canvas}></canvas>
<svelte:window on:resize={onResize} />

<style>
     canvas {
        display: block;
     }
</style>