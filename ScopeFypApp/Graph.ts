class Graph {
  noOfVertices: number;
  AdjList: Map<string, Map<string, number>>;

  constructor(noOfVertices: number = 0) {
    this.noOfVertices = noOfVertices;
    this.AdjList = new Map();
  }

  addVertex(v: string) {
    this.AdjList.set(v, new Map());
  }

  addEdge(v: string, w: string, s: number) {
    const startNode = this.AdjList.get(v);
    if (startNode === undefined) {
      this.AdjList.set(v, new Map());
      this.addEdge(v, w, s);
    } else {
      startNode.set(w, s);
    }
  }

  printGraph() {
    var get_vertex_keys = this.AdjList.keys();

    for (var i of get_vertex_keys) {
      var get_vertex = this.AdjList.get(i);
      var conc = '';

      var get_edge_keys = get_vertex?.keys() ?? [];

      for (var j of get_edge_keys) {
        conc += j + ':' + get_vertex?.get(j) + ';';
      }

      console.log(i + ' -> ' + conc);
    }
  }

  A_Star(start: string, end: string, h: number) {
    const startNode = this.AdjList.get(start);
    const endNode = this.AdjList.get(end);
    if (startNode === undefined && end === undefined) {
      return false;
    }

    const openSet = [];
    const cameFrom = [];
  }
}

export default Graph;
