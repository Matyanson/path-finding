/// <reference lib="webworker" />

import dijkstra from "$lib/algorithms/dijkstra";
import type { Coords, PathFindingAlgorithm, StringCoords, Vertex, WorkerRequest, WorkerResponse } from "$lib/model";
import { coordsEqual, coordsToString, pixelToPoint } from "./util-functions";

let mostRecentRequest: WorkerRequest | null = null;
let isProcessing: boolean = false;

self.onmessage = (event: MessageEvent) => {
    // update request
    mostRecentRequest = event.data;

    // Start processing if last request is finished
    if (!isProcessing) {
        processNextRequest();
    }
};

async function processNextRequest() {
    isProcessing = true;
    // do until no requests are found
    while(mostRecentRequest) {
        // save input data
        const requestData = mostRecentRequest;

        // mark the request as completed
        mostRecentRequest = null;

        // do the calculation
        const response = await getResponse(requestData);

        // return result
        self.postMessage(response);
    }
    isProcessing = false;
}

async function getResponse(request: WorkerRequest): Promise<WorkerResponse> {
    const { startPoint, endPoint, dotSpacing } = request;

    // convert pixels to coords
    const offset = { x: dotSpacing / 2, y: dotSpacing / 2 };
    const start = pixelToPoint(startPoint, offset, dotSpacing);
    const end = pixelToPoint(endPoint, offset, dotSpacing);

    const map = await dijkstra(start, end, dotSpacing);
    
    // get all visited vertexes
    const vertexes = [...map.values()];
    // get shortest path
    const shortestPath = getShortestPath(map, end);

    return {
        allEdges: vertexes,
        shortestPath: shortestPath
    }
}

function getShortestPath(map: Map<StringCoords, Vertex>, end: Coords) {
    const path: Vertex[] = [];

    let curr = map.get(coordsToString(end));
    while(curr && !coordsEqual(curr.coords, curr.parent)) {
        path.push(curr);
        curr = map.get(coordsToString(curr.parent));
    }
    return path;
}
