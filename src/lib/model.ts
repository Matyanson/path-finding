// worker
export type WorkerRequest = {
    startPoint: Coords,
    endPoint: Coords,
    dotSpacing: number
}

export type WorkerResponse = {
    allEdges: Edge[],
    shortestPath: Edge[]
}

export type Edge = {
    coords: Coords,
    parent: Coords
}

export type StringCoords = `${number};${number}`;

export type PathFindingAlgorithm = (
    startPoint: Coords,
    endPoint: Coords,
    dotSpacing: number
) => Promise<WorkerResponse>

// canvas objects
export type Coords = {
    x: number,
    y: number
}