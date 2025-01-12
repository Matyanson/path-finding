<script lang="ts">
    export let src: string;
    export let alt: string;
</script>

<button on:click>
    <img src={src} alt={alt} />
</button>

<style>
 button {
    background: none;
    border: none;
    padding: none;
    cursor: pointer;
 }
</style>