type Path = {node: string; weight: number};

class Graph {
  noOfVertices: number;
  AdjList: Map<string, Path[]>;

  constructor(noOfVertices: number = 0) {
    this.noOfVertices = noOfVertices;
    this.AdjList = new Map();
  }

  addVertex(v: string) {
    this.AdjList.set(v, []);
  }

  addEdge(from: string, node: string, weight: number) {
    this.AdjList.get(from)?.push({node, weight});
  }

  printGraph() {
    var get_vertex_keys = this.AdjList.keys();

    for (var i of get_vertex_keys) {
      var get_vertex = this.AdjList.get(i) ?? [];
      var conc = '';

      get_vertex.forEach(path => {
        conc += path.node + ':' + path.weight + ';';
      });

      console.log(i + ' -> ' + conc);
    }
  }

  reconstructPath(cameFrom: Map<string, Path>, current: Path) {
    const total_path: Path[] = [current];

    for (var i of cameFrom.keys()) {
      console.log('toNode:', i, 'fromNode:', cameFrom.get(i)?.node, 'withWeight:', cameFrom.get(i)?.weight);
    }
    // total_path.push(current);

    return total_path;
  }

  A_Star(start: string, end: string, h: Map<string, number>) {
    const openSet: Path[] = [{node: start, weight: 0}];

    const cameFrom = new Map<string, Path>();

    const gScore = new Map<string, number>();
    gScore.set(start, 0);

    const fScore = new Map<string, number>();
    fScore.set(start, 0);

    while (openSet.length > 0) {
      const current = openSet.pop();
      if (current === undefined) return undefined;

      if (current.node === end) {
        return this.reconstructPath(cameFrom, current);
      }

      this.AdjList.get(current.node)?.forEach(item => {
        const tentativeGScore = gScore.get(current?.node) ?? 0 + item.weight;
        const neighborGScore = gScore.get(item.node);
        if (neighborGScore === undefined || tentativeGScore < neighborGScore) {
          cameFrom.set(item.node, current);
          gScore.set(item.node, tentativeGScore);
          fScore.set(item.node, 0);
          if (openSet.findIndex(setItem => setItem.node === item.node) === -1) {
            openSet.push(item);
          }
          openSet.sort((a, b) => {
            return a.weight - b.weight;
          });
        }
      });
    }

    return undefined;
  }
}

export default Graph;
