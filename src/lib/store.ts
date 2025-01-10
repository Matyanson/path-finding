import { writable } from "svelte/store";

export const canvasState = writable<{ canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D }>();
export const dotSpacing = writable(50);


export function setCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if(!ctx) return;

    canvasState.set({ canvas, ctx });
}