import { get, writable } from "svelte/store";
import type { Coords } from "./model";



export function createMouseController() {
    const position = writable<Coords>({ x: 0, y: 0 });
    const deltaPosition = writable<Coords>({ x: 0, y: 0 });
    const isDown = writable(false);
    const abortController = new AbortController();
    let targetElement: HTMLElement;

    function init(el: HTMLElement) {
        targetElement = el;
        window.addEventListener("mousemove", onMouseMove, { signal: abortController.signal });
        window.addEventListener("mousedown", onMouseDown, { signal: abortController.signal });
        window.addEventListener("mouseup", onMouseUp, { signal: abortController.signal });
    }

    function onMouseMove(e: MouseEvent) {
        if(!get(isDown)) return;

        const { clientX, clientY } = e;
        const { x, y } = get(position);
        const delta: Coords = {
            x: clientX - x,
            y: clientY - y
        }
        deltaPosition.set(delta);
        position.set({ x: clientX, y: clientY });
    }

    function onMouseDown(e: MouseEvent) {
        const { clientX, clientY } = e;
        position.set({ x: clientX, y: clientY });
        isDown.set(true);
    }

    function onMouseUp(e: MouseEvent) {
        isDown.set(false);
    }

    function destroy() {
        abortController.abort();
    }

    return {
        position,
        deltaPosition,
        isDown,
        init,
        destroy
    }
}