import { writable } from "svelte/store";

type Coords = {
    x: number,
    y: number
}

type Point = {
    coords: Coords
}

export const canvasState = writable<{ canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D }>();
export const dotSpacing = writable(50);
export const points = writable<Coords[]>([{x: 25, y: 25}, {x: 525, y: 525}]);
export const startIndex = writable(0);
export const finishIndex = writable(1);

export function setCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if(!ctx) return;

    canvasState.set({ canvas, ctx });
}