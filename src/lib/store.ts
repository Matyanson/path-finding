import { derived, writable } from "svelte/store";
import type { Coords, Vertex } from "./model";

// canvas
export const canvasState = writable<{ canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D }>();
export const dotSpacing = writable(50);
export const points = writable<Coords[]>([{x: 25, y: 25}, {x: 525, y: 525}]);
export const startIndex = writable(0);
export const finishIndex = writable(1);

//constrols
export const selectedType = writable(0);
export const selectedEntity = writable(0);

// algorithm visualization
export const worker = writable<Worker | null>(null);
export const vertexes = writable<Vertex[]>([]);
export const shortestPath = writable<Vertex[]>([]);

// update canvas
const visualStores = [canvasState, dotSpacing, points, startIndex, finishIndex, vertexes];
export const derivedCanvasState = derived(visualStores, (val) => val);

// update path
const pathStores = [dotSpacing, points, startIndex, finishIndex];
export const derivedPathState = derived(pathStores, (val) => val);

export function setCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if(!ctx) return;

    canvasState.set({ canvas, ctx });
}