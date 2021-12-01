class Graph {
  noOfVertices: number;
  AdjList: Map<string, Map<string, number>>;

  // defining vertex array and
  // adjacent list
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

  // Prints the vertex and adjacency list
  printGraph() {
    // get all the vertices
    var get_vertex_keys = this.AdjList.keys();

    // iterate over the vertices
    for (var i of get_vertex_keys) {
      var get_vertex = this.AdjList.get(i);
      var conc = '';

      var get_edge_keys = get_vertex?.keys() ?? [];

      for (var j of get_edge_keys) {
        conc += j + ':' + get_vertex?.get(j) + ';';
      }

      // print the vertex and its adjacency list
      console.log(i + ' -> ' + conc);
    }
  }

  // bfs(v)
  // dfs(v)
}

export default Graph;
