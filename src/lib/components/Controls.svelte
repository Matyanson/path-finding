<script lang="ts">
    import { points, selectedEntity, selectedType } from "$lib/store";

    let closed = true;

    function selectItem(type: number, entity: number) {
        $selectedType = type;
        $selectedEntity = entity;
    }
</script>

<div class="options">
    <button on:click={() => closed = !closed}>
        Options
    </button>
    <div class="menu" class:closed>
        <button on:click={() => closed = !closed}>
            Close
        </button>
        points:
        {#each $points as point, i}
            <div class="item" class:selected={$selectedType == 0 && $selectedEntity == i} >
                <button on:click={() => selectItem(0, i)}>
                    p {i}
                </button>
            </div>
        {/each}
        obstacles:
        <button>add</button>
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

        transition: all 0.5s;
    }
    .menu.closed {
        transform: translateX(100%);
    }

    .item.selected {
        background: #c3ddff;
    }
</style>