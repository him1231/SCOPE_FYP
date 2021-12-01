// export type Graph = {start: path; end: path; [key: string]: path};
// type path = {[key: string]: number};

import Graph from './Graph';

// export const dummyGraph: Graph = {
//   start: {a: 1, b: 2, c: 3},
//   a: {b: 2, c: 3},
//   b: {a: 1, c: 3},
//   c: {a: 1, c: 3, end: 9},
//   end: {a: 1},
// };

export const testGraph = () => {
  const graph = new Graph();
  graph.addVertex('start');
  graph.addVertex('a');
  graph.addVertex('b');
  graph.addVertex('c');
  graph.addVertex('d');
  graph.addVertex('e');
  graph.addVertex('f');
  graph.addVertex('g');
  graph.addVertex('h');
  graph.addVertex('i');
  graph.addVertex('end');

  graph.addEdge('e', 'end', 10);
  graph.addEdge('e', 'c', 10);
  graph.addEdge('h', 'c', 10);
  graph.addEdge('f', 'i', 10);
  graph.addEdge('a', 'c', 10);
  graph.addEdge('g', 'a', 10);
  graph.addEdge('b', 'f', 10);
  graph.addEdge('a', 'c', 10);
  graph.addEdge('b', 'c', 10);
  graph.addEdge('c', 'g', 10);
  graph.addEdge('e', 'f', 10);
  graph.addEdge('f', 'c', 10);
  graph.addEdge('h', 'end', 10);
  graph.addEdge('c', 'h', 10);
  graph.addEdge('start', 'b', 10);
  graph.addEdge('start', 'f', 10);
  graph.addEdge('c', 'a', 10);
  graph.addEdge('start', 'end', 99999);
  graph.addEdge('d', 'a', 10);
  graph.addEdge('b', 'e', 10);
  graph.addEdge('d', 'i', 10);
  graph.addEdge('h', 'a', 10);
  graph.addEdge('d', 'g', 10);
  graph.addEdge('c', 'a', 10);
  graph.addEdge('b', 'g', 10);
  graph.addEdge('g', 'a', 10);
  graph.addEdge('start', 'a', 1000);
  graph.addEdge('a', 'b', 1000);
  graph.addEdge('b', 'c', 1000);
  graph.addEdge('c', 'd', 1000);
  graph.addEdge('d', 'e', 1000);
  graph.addEdge('e', 'f', 1000);
  graph.addEdge('f', 'g', 1000);
  graph.addEdge('g', 'h', 1000);
  graph.addEdge('h', 'i', 1000);
  graph.addEdge('i', 'end', 1000);

  graph.printGraph();
};

export const A_Star = (graph: Graph, h: number) => {
  const openSet = [graph.AdjList.get('start')];
  const cameFrom = [];
};

// function reconstruct_path(cameFrom, current)
//     total_path := {current}
//     while current in cameFrom.Keys:
//         current := cameFrom[current]
//         total_path.prepend(current)
//     return total_path

// // A* finds a path from start to goal.
// // h is the heuristic function. h(n) estimates the cost to reach goal from node n.
// function A_Star(start, goal, h)
//     // The set of discovered nodes that may need to be (re-)expanded.
//     // Initially, only the start node is known.
//     // This is usually implemented as a min-heap or priority queue rather than a hash-set.
//     openSet := {start}

//     // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start
//     // to n currently known.
//     cameFrom := an empty map

//     // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
//     gScore := map with default value of Infinity
//     gScore[start] := 0

//     // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
//     // how short a path from start to finish can be if it goes through n.
//     fScore := map with default value of Infinity
//     fScore[start] := h(start)

//     while openSet is not empty
//         // This operation can occur in O(1) time if openSet is a min-heap or a priority queue
//         current := the node in openSet having the lowest fScore[] value
//         if current = goal
//             return reconstruct_path(cameFrom, current)

//         openSet.Remove(current)
//         for each neighbor of current
//             // d(current,neighbor) is the weight of the edge from current to neighbor
//             // tentative_gScore is the distance from start to the neighbor through current
//             tentative_gScore := gScore[current] + d(current, neighbor)
//             if tentative_gScore < gScore[neighbor]
//                 // This path to neighbor is better than any previous one. Record it!
//                 cameFrom[neighbor] := current
//                 gScore[neighbor] := tentative_gScore
//                 fScore[neighbor] := tentative_gScore + h(neighbor)
//                 if neighbor not in openSet
//                     openSet.add(neighbor)

//     // Open set is empty but goal was never reached
//     return failure
