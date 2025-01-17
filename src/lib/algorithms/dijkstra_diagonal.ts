import type { Box, Coords, Edge, PathFindingAlgorithm, StringCoords } from "$lib/model";
import { coordsEqual, coordsToString, } from "$lib/workers/util-functions";

type Vertex = {
    coords: Coords,
    parent: Coords,
    dist: number,
    visited: boolean
}

const vertexMap = new Map<StringCoords, Vertex>();

const dijkstra_diagonal: PathFindingAlgorithm = async (
    startPoint: Coords,
    endPoint: Coords,
    obstacles: Box[]
) => {
    vertexMap.clear();

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
    const vertex = vertexMap.get(coordsToString(coords));
    if(!vertex) return [];
    vertex.visited = true;

    const nextNeighbours: Coords[] = [];
    const dist = vertex.dist;
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

        if(!wasVisited(neighbourCoords))
            nextNeighbours.push(neighbourCoords);
        updateNeighbour(neighbourCoords, coords, dist);
    }
    function processNeighbourDiag(neighbourCoords: Coords, dist: number) {
        if(isBlocked(coords, neighbourCoords, obstacles)) return;

        updateNeighbour(neighbourCoords, coords, dist);
    }
}

function updateNeighbour(coords: Coords, parentCoords: Coords, dist: number) {
    const key = coordsToString(coords);
    const vertex = vertexMap.get(key);
    const newVertex = {
        coords,
        parent: parentCoords,
        dist,
        visited: false
    };
    if(!vertex || dist < vertex.dist) {
        // update value in the map
        vertexMap.set(key, newVertex);
    }
}

function wasVisited(coords: Coords) {
    const vertex = vertexMap.get(coordsToString(coords));
    return vertex?.visited ?? false;
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

    let curr = vertexMap.get(coordsToString(end));
    while(curr && !coordsEqual(curr.coords, curr.parent)) {
        path.push({ coords: curr.coords, parent: curr.parent });
        curr = vertexMap.get(coordsToString(curr.parent));
    }
    return path;
}

function getAllEdges() {
    const edges = [...vertexMap.values().map(v => {
        return { coords: v.coords, parent: v.parent }
    })];
    return edges;
}

export default dijkstra_diagonal;