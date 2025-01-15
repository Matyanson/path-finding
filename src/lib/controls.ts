import { get } from "svelte/store";
import { canvasState, dotSpacing, finishIndex, points, sharedStore, shortestPath, startIndex, vertexes } from "./store";
import type { Coords, Vertex } from "./model";

// update canvas on state change
sharedStore.subscribe(() => {
    updateCanvas();
});

export function movePoint(index: number, delta: Coords) {
    points.update(p => {
        if(!p[index]) return p;

        const newPoints = [...p];
        const point = p[index];
        newPoints[index] = {
            x: point.x + delta.x,
            y: point.y + delta.y
        };
        return newPoints;
    });
}

export function updateCanvas() {
    if(!get(canvasState)) return;

    const { canvas, ctx } = get(canvasState);
    const offset = get(dotSpacing) / 2;

    //clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw all paths
    ctx.strokeStyle = "#aaa";
    const edges = get(vertexes);
    for(const edge of edges) {
        const { coords, parent } = edge;
        drawLine(
            ctx,
            toCanvasCoords(coords, get(dotSpacing), offset),
            toCanvasCoords(parent, get(dotSpacing), offset),
        );
    }

    // draw the shortest path
    ctx.strokeStyle = "#0a0";
    const path = get(shortestPath);
    for(const edge of path) {
        const { coords, parent } = edge;
        drawLine(
            ctx,
            toCanvasCoords(coords, get(dotSpacing), offset),
            toCanvasCoords(parent, get(dotSpacing), offset),
            4
        );
    }

    // draw coord points
    ctx.fillStyle = "#aaa";
    for (let y = offset; y < canvas.height; y += get(dotSpacing)) {
        for (let x = offset; x < canvas.width; x+= get(dotSpacing)) {
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

function drawLine(ctx: CanvasRenderingContext2D, p1: Coords, p2: Coords, width = 1) {
    ctx.lineWidth = width;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.closePath();
}

function toCanvasCoords(coords: Coords, dotSpacing: number, offset: number) {
    return { 
        x: coords.x * dotSpacing + offset,
        y: coords.y * dotSpacing + offset
    };
}