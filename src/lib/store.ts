import { derived, writable } from "svelte/store";
import type { Coords } from "./model";

export const canvasState = writable<{ canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D }>();
export const dotSpacing = writable(50);
export const points = writable<Coords[]>([{x: 25, y: 25}, {x: 525, y: 525}]);
export const startIndex = writable(0);
export const finishIndex = writable(1);
export const selectedType = writable(0);
export const selectedEntity = writable(0);

const allStores = [canvasState, dotSpacing, points, startIndex, finishIndex];
export const sharedStore = derived(allStores, (val) => val);

export function setCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if(!ctx) return;

    canvasState.set({ canvas, ctx });
}