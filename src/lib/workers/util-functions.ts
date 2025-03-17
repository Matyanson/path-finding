import type { Box, Coords, StringCoords } from "$lib/model";

export function pixelToPointRound(pixel: Coords, offset: Coords, spacing: number) {
    return {
        x: Math.round((pixel.x - offset.x) / spacing),
        y: Math.round((pixel.y - offset.y) / spacing)
    }
}
export function pixelToPoint(pixel: Coords, offset: Coords, spacing: number) {
    return {
        x: (pixel.x - offset.x) / spacing,
        y: (pixel.y - offset.y) / spacing
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

export function getDistance(c1: Coords, c2: Coords) {
    return Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2));
}

export function getBoardBounds(points: Coords[], boxes: Box[]): Box {
    const coordList: Coords[] = points
    .concat(
        boxes.map(b => [
            b.coords,
            { x: b.coords.x + b.width, y: b.coords.y + b.height }
        ])
        .flat()
    );

    const topLeft: Coords = { x: coordList[0].x ?? 0, y: coordList[0].y ?? 0 };
    const bottomRight: Coords = { x: coordList[0].x ?? 0, y: coordList[0].y ?? 0 };

    for(const c of coordList) {
        if(c.x < topLeft.x) topLeft.x = c.x;
        if(c.y < topLeft.y) topLeft.y = c.y;
        if(c.x > bottomRight.x) bottomRight.x = c.x;
        if(c.y > bottomRight.y) bottomRight.y = c.y;
    }

    return {
        coords: { x: Math.floor(topLeft.x), y: Math.floor(topLeft.y) },
        width: Math.ceil(bottomRight.x - topLeft.x),
        height: Math.ceil(bottomRight.y - topLeft.y)
    };
}