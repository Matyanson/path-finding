import type { PathFindingAlgorithm } from "$lib/model"
import dijkstra from "./dijkstra";
import dijkstra_diagonal from "./dijkstra_diagonal";
import a_star from "./a_star";

type PathFindingAlgorithmObj = {
    name: string,
    func: PathFindingAlgorithm
}

const algorithms: PathFindingAlgorithmObj[] = [
    {
        name: "a-star",
        func: a_star
    },
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