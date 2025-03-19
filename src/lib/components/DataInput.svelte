<script lang="ts">
    import { loadData, saveData } from "$lib/file";
    import FileInput from "./FileInput.svelte";

    const handleDataChange = (file: File) => {
        const nameSplit = file.name.split('.');
        console.log(nameSplit);

        if(nameSplit[nameSplit.length - 1] != 'json') return;

        const reader = new FileReader();
        reader.onload = () => {
            const { result } = reader;
            
            if(result != null && typeof result == "string")
                loadData(result);
        }
        reader.readAsText(file);
    }

</script>
<FileInput accept='.json' multiple={false} onChange={handleDataChange} />