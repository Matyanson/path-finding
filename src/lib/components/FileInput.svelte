<script lang="ts">
    export let accept = '';
    export let multiple = false;
    export let onChange: (file: File) => void = () => {};

    const handleFileChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if(! target.files || target.files.length < 0) return;

        const file = target.files[0];
        onChange(file);
    }
</script>

<input
    type="file"
    accept={accept}
    multiple={multiple}
    on:change={handleFileChange}
/>