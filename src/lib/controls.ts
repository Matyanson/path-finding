import { get } from "svelte/store";
import { canvasState, dotSpacing } from "./store";

export function drawCanvas() {
    const { canvas, ctx } = get(canvasState);

    // draw pionts
    ctx.fillStyle = "#aaa";
    for (let y = get(dotSpacing) / 2; y < canvas.height; y += get(dotSpacing)) {
        for (let x = get(dotSpacing) / 2; x < canvas.width; x+= get(dotSpacing)) {
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
    }
}