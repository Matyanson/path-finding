<script lang="ts">
    import { addObstacle } from "$lib/controls";
    import { boxes, points, selectedEntity, selectedType } from "$lib/store";
    import IconButton from "./IconButton.svelte";
    import ItemButton from "./ItemButton.svelte";
    import WorkerControls from "./WorkerControls.svelte";

    let closed = false;

    
</script>

<div class="options">
    <IconButton on:click={() => closed = !closed} src="icons/settings.svg" alt="open settings" />
    <div class="menu" class:closed>
        <IconButton on:click={() => closed = !closed} src="icons/x-circle.svg" alt="close menu" />
        points:
        {#each $points as point, i}
            <ItemButton type={0} index={i} />
        {/each}
        obstacles:
        {#each $boxes as box, i}
            <ItemButton type={1} index={i} />
        {/each}
        <IconButton src="icons/plus-circle.svg" alt="add obstacle" on:click={() => {addObstacle({x:0,y:0}, 200, 200)}} />
        Properties:
        <div class="properties">
        {#if $selectedType == 1}
            width: <input type="range" max="1000" bind:value={$boxes[$selectedEntity].width} />
            height: <input type="range" max="1000" bind:value={$boxes[$selectedEntity].height} />
        {/if}
        </div>
        Calculation:
        <WorkerControls />
    </div>
</div>

<style>
    .options {
        position: relative;
        padding: 1rem;
    }
    .menu {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        flex-flow: column;
        padding: 1rem;
        background: #fff;
        border: 5px solid #d5d5d5;
        border-radius: 0.5rem;

        transition: all 0.5s;
    }
    .menu.closed {
        transform: translateX(100%);
    }
</style>