// worker
export type WorkerRequest = {
    startPoint: Coords,
    endPoint: Coords,
    dotSpacing: number
}

export type WorkerResponse = Vertex[];

export enum EdgeDir {
    Right,
    Down
}

export enum EdgeType {
    Valid,
    Blocked
}

export type GraphEdge = {
    position: Coords,
    direction: EdgeDir
}

export type Vertex = {
    coords: Coords,
    parent: Coords,
    dist: number
}

export type StringCoords = `${number};${number}`;

export type PathFindingAlgorithm = (
    startPoint: Coords,
    endPoint: Coords,
    dotSpacing: number
) => Promise<Vertex[]>

// canvas objects
export type Coords = {
    x: number,
    y: number
}