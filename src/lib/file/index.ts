import { boxes, points } from "$lib/store";
import { get } from "svelte/store";


export const saveData = (name: string) => {
    const data = {
        points: get(points),
        boxes: get(boxes)
    }

    const jsonStr = JSON.stringify(data);
    downloadFile(`${name}.json`, [jsonStr], 'application/json');
}

export const loadData = (string: string) => {
    try {
        const data = JSON.parse(string);

        points.set(data.points);
        boxes.set(data.boxes);
    } catch (error) {
        
    }
}

export const downloadFile = (fileName: string, blobParts: BlobPart[], mimeType: string) => {
    let blob = new Blob(blobParts, {type: mimeType});
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
};