<script lang="ts">
    import { selectedEntity, selectedType } from "$lib/store";

    export let type: number;
    export let index: number;

    function selectItem(type: number, entity: number) {
        $selectedType = type;
        $selectedEntity = entity;
    }
</script>

<button
class="item"
class:selected={$selectedType == type && $selectedEntity == index}
on:click={() => selectItem(type, index)}
>
    <div class="head">{index}</div>
    <div class="body">
        {#if type == 0}
        Point {index}
        {:else if type == 1}
        Obstacle {index}
        {/if}
    </div>
</button>

<style>
    button {
        border: none;
        background: none;
        cursor: pointer;
    }
    .item {
        display: flex;
        flex-flow: row nowrap;
        padding: 0;
        border-bottom: 1px solid #dfdfdf;
    }
    .item.selected {
        background: #c3ddff;
    }
    .head {
        background: #e1e1e1;
        padding: 0.2rem 0.5rem;
    }
    .body {
        display: flex;
        flex-flow: row nowrap;
        text-wrap: nowrap;
        padding: 0.2rem 0.5rem;
    }
</style>