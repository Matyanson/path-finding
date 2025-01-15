/// <reference lib="webworker" />

import dijkstra from "$lib/algorithms/dijkstra";
import type { WorkerRequest, WorkerResponse } from "$lib/model";
import { pixelToPoint } from "./util-functions";

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

    const res = await dijkstra(start, end, dotSpacing);
    
    return res;
}
