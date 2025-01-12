/// <reference lib="webworker" />

let mostRecentRequest: number | null = null;
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
        const response = await mockPathFindingCalculation(requestData);

        // return result
        self.postMessage(`Calculation no. ${response} done!`);
    }
    isProcessing = false;
}

// simulate heavy computation using a promise-based delay
function mockPathFindingCalculation(input: any): Promise<void> {
    return new Promise((resolve) => {
        // Simulate a 1-second heavy computation
        setTimeout(() => resolve(input), 1000);
    });
}
