/// <reference lib="webworker" />

import algorithms from "$lib/algorithms";
import type { Box, WorkerRequest, WorkerResponse } from "$lib/model";
import { pixelToPoint, pixelToPointRound } from "./util-functions";

let lastRequestProcessedTime = 0;

self.onmessage = (event: MessageEvent) => {
    // update request
    const request = event.data as WorkerRequest;

    // Start processing if event is not outdated
    if (request.timestamp > lastRequestProcessedTime) {
        processNextRequest(request);
    }
};

async function processNextRequest(request: WorkerRequest) {
    // do the calculation
    const response = await getResponse(request);

    // return result
    self.postMessage(response);

    // record timestamp of completion relative to origin
    lastRequestProcessedTime = performance.now() + performance.timeOrigin;
}

async function getResponse(request: WorkerRequest): Promise<WorkerResponse> {
    const { startPoint, endPoint, dotSpacing, obstacles, algorithmIndex } = request;

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
    const getShortestPath = algorithms[algorithmIndex].func;
    const res = await getShortestPath(start, end, pointBoxes);
    
    return res;
}
