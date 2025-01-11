import { get } from "svelte/store";
import { canvasState, dotSpacing, finishIndex, points, startIndex } from "./store";

export function updateCanvas() {
    if(!get(canvasState)) return;

    const { canvas, ctx } = get(canvasState);

    //clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw coord points
    ctx.fillStyle = "#aaa";
    for (let y = get(dotSpacing) / 2; y < canvas.height; y += get(dotSpacing)) {
        for (let x = get(dotSpacing) / 2; x < canvas.width; x+= get(dotSpacing)) {
            drawPoint(ctx, x, y, 3);
        }
    }
    
    // draw start and finish points
    const startCoords = get(points)[get(startIndex)];
    const finishCoords = get(points)[get(finishIndex)];

    ctx.fillStyle = "#0a0";
    drawPoint(ctx, startCoords.x, startCoords.y, 10);
    ctx.fillStyle = "#a00";
    drawPoint(ctx, finishCoords.x, finishCoords.y, 10);

}

/* HELPER FUNCTIONS */
function drawPoint(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}