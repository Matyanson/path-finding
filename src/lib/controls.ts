import { get } from "svelte/store";
import { boxes, canvasState, derivedCanvasState, derivedPathState, dotSpacing, finishIndex, points, selectedAlgorithm, selectedEntity, selectedType, shortestPath, startIndex, vertexes, worker } from "./store";
import type { Box, Coords, WorkerRequest } from "./model";

// update canvas on state change
derivedCanvasState.subscribe(() => {
    updateCanvas();
});

derivedPathState.subscribe(() => {
    // update path
    calculatePath();
});

export function calculatePath(priority = false) {
    const w = get(worker);
    if(!w) return;
    
    const request: WorkerRequest = {
        startPoint: get(points)[get(startIndex)],
        endPoint: get(points)[get(finishIndex)],
        dotSpacing: get(dotSpacing),
        obstacles: get(boxes),
        timestamp: priority ? Infinity : performance.now() + performance.timeOrigin,
        algorithmIndex: get(selectedAlgorithm)
    };
    w.postMessage(request);
}

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

export function moveObstacle(index: number, delta: Coords) {
    boxes.update(b => {
        if(!b[index]) return b;

        const newBoxes = [...b];
        const box = b[index];
        const newCoords = {
            x: box.coords.x + delta.x,
            y: box.coords.y + delta.y
        };
        newBoxes[index] = {
            ...box,
            coords: newCoords
        }
        return newBoxes;
    });
}

export function addObstacle(coords: Coords, width: number, height: number) {
    // add the new box
    boxes.update((boxes) => {
        const newBox: Box = {
            coords,
            width,
            height
        }
        const newBoxes = [
            ...boxes,
            newBox
        ]
        return newBoxes;
    })
    // select the new box
    selectedType.set(1);
    selectedEntity.set(get(boxes).length - 1);
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

    // // draw coord points
    // const pointRadius = get(dotSpacing) / 16;
    // ctx.fillStyle = "#aaa";
    // for (let y = offset; y < canvas.height; y += get(dotSpacing)) {
    //     for (let x = offset; x < canvas.width; x+= get(dotSpacing)) {
    //         drawPoint(ctx, x, y, pointRadius);
    //     }
    // }
    
    // draw start and finish points
    const startCoords = get(points)[get(startIndex)];
    const finishCoords = get(points)[get(finishIndex)];

    ctx.fillStyle = "#0a0";
    drawPoint(ctx, startCoords.x, startCoords.y, 10);
    ctx.fillStyle = "#a00";
    drawPoint(ctx, finishCoords.x, finishCoords.y, 10);


    // draw obstacles
    ctx.fillStyle = "#333";
    const boxList = get(boxes);
    for(const box of boxList) {
        drawRect(ctx, box.coords, box.width, box.height);
    }

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

function drawRect(ctx: CanvasRenderingContext2D, coords: Coords, width: number, height: number) {
    ctx.beginPath();
    ctx.rect(coords.x, coords.y, width, height);
    ctx.fill();
    ctx.closePath();
}

function toCanvasCoords(coords: Coords, dotSpacing: number, offset: number) {
    return { 
        x: coords.x * dotSpacing + offset,
        y: coords.y * dotSpacing + offset
    };
}