import type { Coords, Edge, PathFindingAlgorithm, StringCoords } from "$lib/model";
import { coordsEqual, coordsToString, } from "$lib/workers/util-functions";

type Vertex = {
    edge: Edge,
    dist: number,
    visited: boolean
}

const vertexMap = new Map<StringCoords, Vertex>();

const dijkstra_diagonal: PathFindingAlgorithm = async (
    startPoint: Coords,
    endPoint: Coords,
    dotSpacing: number
) => {
    vertexMap.clear();

    // save start vertex to the map
    updateNeighbour(startPoint, startPoint, 0);

    let queue: Coords[] = [{...startPoint}];
    let endReached = false;
    let it = 0;
    const maxIt = 30;

    while(queue.length > 0 && !endReached && it < maxIt) {
        it++;
        const children: Coords[] = [];
        for(const coords of queue) {
            // 1. check for end vertex
            if(coords.x == endPoint.x && coords.y == endPoint.y){
                endReached = true;
                break;
            }
            // 2. process neighbours and get next ones to process
            const nextNeighbours = processNeighbours(coords);
            // 3. add nearest neighbours to the queue
            children.push(...nextNeighbours);
        }
        
        // 4. prepare for next itteration
        queue = children;
        console.log(queue.length > 0, !endReached);
    }

    // get shortest path
    const shortestPath = getShortestPath(endPoint);
    // get all edges
    const allEdges = getAllEdges();

    return {
        allEdges,
        shortestPath
    };
};


function processNeighbours(coords: Coords): Coords[] {
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
    updateNeighbour({ x: x + 1, y: y + 1}, coords, dist + root2);
    updateNeighbour({ x: x - 1, y: y + 1}, coords, dist + root2);
    updateNeighbour({ x: x - 1, y: y - 1}, coords, dist + root2);
    updateNeighbour({ x: x + 1, y: y - 1}, coords, dist + root2);

    return nextNeighbours;

    // helper function
    function processNeighbour(neighbourCoords: Coords, dist: number) {
        if(!wasVisited(neighbourCoords))
            nextNeighbours.push(neighbourCoords);
        updateNeighbour(neighbourCoords, coords, dist);
    }
}

function updateNeighbour(coords: Coords, parentCoords: Coords, dist: number) {
    const key = coordsToString(coords);
    const vertex = vertexMap.get(key);
    const newVertex = {
        edge: { coords, parent: parentCoords },
        dist,
        visited: false
    };
    if(!vertex || dist < vertex.dist) {
        // update value in the map
        vertexMap.set(key, newVertex);
    }
}

function wasVisited(coords: Coords): boolean {
    const isPresent = vertexMap.has(coordsToString(coords));
    if(!isPresent) return false;

    const vertex = vertexMap.get(coordsToString(coords));
    return vertex?.visited ?? false;
}

function getShortestPath(end: Coords) {
    const path: Edge[] = [];

    let curr = vertexMap.get(coordsToString(end));
    while(curr && !coordsEqual(curr.edge.coords, curr.edge.parent)) {
        path.push(curr.edge);
        curr = vertexMap.get(coordsToString(curr.edge.parent));
    }
    return path;
}

function getAllEdges() {
    const edges = [...vertexMap.values().map(v => v.edge)];
    return edges;
}

export default dijkstra_diagonal;