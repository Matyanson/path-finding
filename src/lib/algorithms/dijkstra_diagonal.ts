import type { Box, Coords, Edge, PathFindingAlgorithm, StringCoords } from "$lib/model";
import { coordsEqual, coordsToString, } from "$lib/workers/util-functions";
import PathfindingGrid from "./data-structures/grid";

const width = 1000;
const height = 1000;
let grid: PathfindingGrid;

const dijkstra_diagonal: PathFindingAlgorithm = async (
    startPoint: Coords,
    endPoint: Coords,
    obstacles: Box[]
) => {
    grid = new PathfindingGrid(width, height, startPoint);

    // save start vertex to the map
    updateNeighbour(startPoint, startPoint, 0);

    let queue: Coords[] = [{...startPoint}];
    let endReached = false;
    let i = 0;

    while(queue.length > 0 && !endReached && i < 20) {
        const children: Coords[] = [];
        for(const coords of queue) {
            // 1. check for end vertex
            if(coords.x == endPoint.x && coords.y == endPoint.y){
                endReached = true;
                break;
            }
            // 2. process neighbours and get next ones to process
            const nextNeighbours = processNeighbours(coords, obstacles);
            // 3. add nearest neighbours to the queue
            children.push(...nextNeighbours);
        }
        
        // 4. prepare for next itteration
        queue = children;
        i++;
    }

    const shortestPath = getShortestPath(endPoint);
    const allEdges = getAllEdges();


    return {
        allEdges,
        shortestPath
    };
};


function processNeighbours(coords: Coords, obstacles: Box[]): Coords[] {
    const vertex = grid.getVertexView(coords.x, coords.y);
    vertex.isVisited = true;

    const nextNeighbours: Coords[] = [];
    const dist = vertex.distance;
    const { x, y } = coords;
    processNeighbour({ x: x + 1,  y: y },       dist + 1);
    processNeighbour({ x: x,      y: y + 1 },   dist + 1);
    processNeighbour({ x: x - 1,  y: y },       dist + 1);
    processNeighbour({ x: x,      y: y - 1 },   dist + 1);

    const root2 = Math.SQRT2;
    processNeighbourDiag({ x: x + 1, y: y + 1}, dist + root2);
    processNeighbourDiag({ x: x - 1, y: y + 1}, dist + root2);
    processNeighbourDiag({ x: x - 1, y: y - 1}, dist + root2);
    processNeighbourDiag({ x: x + 1, y: y - 1}, dist + root2);

    return nextNeighbours;

    // helper function
    function processNeighbour(neighbourCoords: Coords, dist: number) {
        if(isBlocked(coords, neighbourCoords, obstacles)) return;

        if(!wasVisited(neighbourCoords)) {
            nextNeighbours.push(neighbourCoords);
            updateNeighbour(neighbourCoords, coords, dist);
        }
    }
    function processNeighbourDiag(neighbourCoords: Coords, dist: number) {
        if(isBlocked(coords, neighbourCoords, obstacles)) return;

        if(!wasVisited(neighbourCoords)) {
            updateNeighbour(neighbourCoords, coords, dist);
        }
    }
}

function updateNeighbour(coords: Coords, parentCoords: Coords, dist: number) {
    const vertex = grid.getVertexView(coords.x, coords.y);
    if(!vertex.isInitialized || dist < vertex.distance) {
        // update value in the grid
        vertex.parent = grid.getIndex(parentCoords.x, parentCoords.y);
        vertex.distance = dist;
        vertex.isInitialized = true;
    }
}

function wasVisited(coords: Coords) {
    const vertex = grid.getVertexView(coords.x, coords.y);
    return vertex.isVisited;
}

function isColiding(p1: Coords, p2: Coords, box: Box) {
    return  p1.x > box.coords.x && p1.x < box.coords.x + box.width &&   // p1 inside box
            p1.y > box.coords.y && p1.y < box.coords.y + box.height ||
            p2.x > box.coords.x && p2.x < box.coords.x + box.width &&   // p2 inside box
            p2.y > box.coords.y && p2.y < box.coords.y + box.height;
}

function isBlocked(p1: Coords, p2: Coords, obstacles: Box[]) {
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
    do {
        path.push({ coords: prevCoords, parent: currCoords });
        curr = grid.getVertexView(currCoords.x, currCoords.y);
        prevCoords = { x: currCoords.x, y: currCoords.y };
        currCoords = grid.getCoords(curr.parent);
    } while(curr.isInitialized && !coordsEqual(currCoords, prevCoords))
    return path;
}

function getAllEdges() {
    const edges: Edge[] = [];
    const offsetX = grid.offsetX;
    const offsetY = grid.offsetY;
    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
            const v = grid.getVertexView(x - offsetX, y - offsetY);
            if(!v.isInitialized) continue;

            const parentCoords = grid.getCoords(v.parent);
            edges.push({
                coords: { x: x - offsetX, y: y - offsetY },
                parent: parentCoords
            });
        }
    }
    return edges;
}

export default dijkstra_diagonal;