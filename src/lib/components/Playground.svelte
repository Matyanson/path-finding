<script lang="ts">
    import { onMount } from "svelte";


    let canvas: HTMLCanvasElement;

    function onResize() {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;

        console.log(canvas.width, canvas.height);
    }

    onMount(onResize);

</script>

<canvas bind:this={canvas}></canvas>
<svelte:window on:resize={onResize} />

<style>
     canvas {
        display: block;
     }
</style>