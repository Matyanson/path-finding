/// <reference lib="webworker" />

import dijkstra from "$lib/algorithms/dijkstra";
import dijkstra_diagonal from "$lib/algorithms/dijkstra_diagonal";
import type { Box, WorkerRequest, WorkerResponse } from "$lib/model";
import { pixelToPoint, pixelToPointRound } from "./util-functions";

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
    const { startPoint, endPoint, dotSpacing, obstacles } = request;

    // --- convert pixels to point coords ---
    // points
    const offset = { x: dotSpacing / 2, y: dotSpacing / 2 };
    const start = pixelToPointRound(startPoint, offset, dotSpacing);
    const end = pixelToPointRound(endPoint, offset, dotSpacing);

    // obstacles
    const pointBoxes = obstacles.map(box => {
        const dimensions = { x: box.width, y: box.height };
        const pointDimensions = pixelToPoint(dimensions, { x: 0, y: 0 }, dotSpacing);
        const res: Box =  {
            coords: pixelToPoint(box.coords, offset, dotSpacing),
            width: pointDimensions.x,
            height: pointDimensions.y
        }
        return res;
    })

    console.log(start, end, pointBoxes);

    const res = await dijkstra(start, end, pointBoxes);
    // const res = await dijkstra_diagonal(start, end, dotSpacing);
    
    return res;
}
