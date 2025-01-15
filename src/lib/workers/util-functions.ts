import type { Coords, StringCoords } from "$lib/model";

export function pixelToPoint(pixel: Coords, offset: Coords, spacing: number) {
    return {
        x: Math.round((pixel.x - offset.x) / spacing),
        y: Math.round((pixel.y - offset.y) / spacing)
    }
}

export function coordsToString(coords: Coords): StringCoords {
    return `${coords.x};${coords.y}`;
}

export function stringToCoords(str: StringCoords): Coords {
    const [ x, y ] = str.split(';');
    return { x: Number(x), y: Number(y) };
}

export function coordsEqual(c1: Coords, c2: Coords) {
    return c1.x == c2.x && c1.y == c2.y;
}