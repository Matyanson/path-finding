import type { PathFindingAlgorithm } from "$lib/model"
import dijkstra from "./dijkstra";
import dijkstra_diagonal from "./dijkstra_diagonal";

type PathFindingAlgorithmObj = {
    name: string,
    func: PathFindingAlgorithm
}

const algorithms: PathFindingAlgorithmObj[] = [
    {
        name: "dijkstra",
        func: dijkstra_diagonal
    },
    {
        name: "dijkstra manhatan",
        func: dijkstra
    }
];

export default algorithms;