import type { Box, Coords, Edge, PathFindingAlgorithm, StringCoords } from "$lib/model";
import { coordsEqual, coordsToString, getBoardBounds, getDistance, } from "$lib/workers/util-functions";
import PathfindingGrid from "./data-structures/grid";

let grid: PathfindingGrid;

type VertexData = {
    coords: Coords,
    score: number
}

const a_star: PathFindingAlgorithm = async (
    startPoint: Coords,
    endPoint: Coords,
    obstacles: Box[]
) => {
    const bounds = getBoardBounds([startPoint, endPoint], obstacles);
    grid = new PathfindingGrid({ x: bounds.coords.x, y: bounds.coords.y }, bounds.width + 1, bounds.height + 1);

    // save start vertex to the map
    updateNeighbour(startPoint, startPoint, 0);

    const startVertex: VertexData = {
        coords: startPoint,
        score: 0 + getDistance(startPoint, endPoint)
    };
    let queue: VertexData[] = [startVertex];
    let endReached = false;
    let i = 0;
    let queueStart = 0; // queue start index

    while(queue.length > queueStart && !endReached) {
        // arr.shift() without shifting all elements
        const vertexData = queue[queueStart] as VertexData;
        queueStart++;
        const coords = vertexData.coords;
        // 1. check for end vertex
        if(coords.x == endPoint.x && coords.y == endPoint.y){
            endReached = true;
            break;
        }
        // 2. process neighbours and get next ones to process
        const nextNeighbours = processNeighbours(coords, obstacles);
        // 3. add nearest neighbours to the queue
        for(const nextVertexData of nextNeighbours) {
            insertVertex(nextVertexData);
        }
        
        i++;
    }

    const shortestPath = getShortestPath(endPoint);
    const allEdges = getAllEdges();


    return {
        allEdges,
        shortestPath
    };

    
    function insertVertex(vertexData: VertexData) {
        queue.push(vertexData);

        for (let i = queue.length - 1; i > queueStart; i--) {
            if(queue[i].score >= queue[i - 1].score) break;

            const temp = queue[i - 1];
            queue[i - 1] = queue[i];
            queue[i] = temp;
        }
    }

    function processNeighbours(coords: Coords, obstacles: Box[]): VertexData[] {
        if(!grid.isInBounds(coords.x, coords.y)) return [];
    
        const vertex = grid.getVertexView(coords.x, coords.y);
        vertex.isVisited = true;
    
        const nextNeighbours: VertexData[] = [];
        const dist = vertex.distance;
        const { x, y } = coords;
        processNeighbour({ x: x + 1,  y: y },       dist + 1);
        processNeighbour({ x: x,      y: y + 1 },   dist + 1);
        processNeighbour({ x: x - 1,  y: y },       dist + 1);
        processNeighbour({ x: x,      y: y - 1 },   dist + 1);
    
        const root2 = Math.SQRT2;
        processNeighbour({ x: x + 1, y: y + 1}, dist + root2);
        processNeighbour({ x: x - 1, y: y + 1}, dist + root2);
        processNeighbour({ x: x - 1, y: y - 1}, dist + root2);
        processNeighbour({ x: x + 1, y: y - 1}, dist + root2);
    
        return nextNeighbours;
    
        // helper function
        function processNeighbour(neighbourCoords: Coords, dist: number) {
            if(isBlocked(coords, neighbourCoords, obstacles)) return;
    
            if(!wasVisited(neighbourCoords)) {
                const nextVertexData = updateNeighbour(neighbourCoords, coords, dist);
                if(nextVertexData)
                    nextNeighbours.push(nextVertexData);
            }
        }
    }
    
    function updateNeighbour(coords: Coords, parentCoords: Coords, dist: number): VertexData | null {
        const vertex = grid.getVertexView(coords.x, coords.y);
        if(!vertex.isInitialized || dist < vertex.distance) {
            // update value in the grid
            vertex.parent = grid.getIndex(parentCoords.x, parentCoords.y);
            vertex.distance = dist;
            vertex.isInitialized = true;

            // and update in queue
            const vertexData: VertexData = {
                coords: coords,
                score: vertex.distance + getDistance(coords, endPoint)
            }
            return vertexData;
        }
        return null;
    }
};

function wasVisited(coords: Coords) {
    try {
        const vertex = grid.getVertexView(coords.x, coords.y);
        return vertex.isVisited;
    } catch {
        return true;
    }
}

function isColiding(p1: Coords, p2: Coords, box: Box) {
    return  p1.x > box.coords.x && p1.x < box.coords.x + box.width &&   // p1 inside box
            p1.y > box.coords.y && p1.y < box.coords.y + box.height ||
            p2.x > box.coords.x && p2.x < box.coords.x + box.width &&   // p2 inside box
            p2.y > box.coords.y && p2.y < box.coords.y + box.height;
}

function isBlocked(p1: Coords, p2: Coords, obstacles: Box[]) {
    if(!grid.isInBounds(p1.x, p1.y) || !grid.isInBounds(p2.x, p2.y))
        return true;
    
    for(const box of obstacles) {
        const isInside = isColiding(p1, p2, box);
        if(isInside) return true;
    }
    return false;
}

function getShortestPath(end: Coords) {
    const path: Edge[] = [];

    let curr = grid.getVertexView(end.x, end.y);
    let prevCoords = end;
    let currCoords = grid.getCoords(curr.parent);
    while(curr.isInitialized && !coordsEqual(currCoords, prevCoords)) {
        path.push({ coords: prevCoords, parent: currCoords });
        curr = grid.getVertexView(currCoords.x, currCoords.y);
        prevCoords = { x: currCoords.x, y: currCoords.y };
        currCoords = grid.getCoords(curr.parent);
    }
    return path;
}

function getAllEdges() {
    const edges: Edge[] = [];
    for(let y = 0; y < grid.n; y++) {
        for(let x = 0; x < grid.m; x++) {
            const v = grid.getVertexView(x + grid.offsetX, y + grid.offsetY);
            if(!v.isInitialized) continue;

            const parentCoords = grid.getCoords(v.parent);
            edges.push({
                coords: { x: x + grid.offsetX, y: y + grid.offsetY },
                parent: parentCoords
            });
        }
    }
    return edges;
}

export default a_star;