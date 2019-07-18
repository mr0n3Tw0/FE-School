class NewGraph {

    constructor(isDirected) {
        this.notDirected = isDirected;
        this.vertexes = new Map();
        this.edges = new Map();
    }


    vertexes;
    edges;
    notDirected;


    addVertex(vertexName) {
        if (!this.vertexes.has(vertexName))
            this.vertexes.set(vertexName, new Vertex(vertexName));
    }

    addEdge(startVertexName, endVertexName, cost) {

        this.addVertex(startVertexName);
        this.addVertex(endVertexName);
        let edgeName = startVertexName.concat(endVertexName);
        if (!this.edges.has(edgeName)) {
            this.edges.set(edgeName, new Edge(startVertexName, endVertexName, cost));
            console.log( `edge ${edgeName} added`);

            if(this.notDirected){
                edgeName=reverseString(edgeName);
                this.edges.set(edgeName, new Edge( endVertexName,startVertexName, cost));
                console.log( `edge ${edgeName} added`);
            }

        } else  console.log( `edge already exists`);

    }

    getNeighbours(vertexName){
        if(!this.vertexes.has(vertexName))return "vertex does not exist";
        let neighbors = [];
        Array.from(this.edges.values()).forEach(edge => {
            if(edge.startVertex.localeCompare(vertexName)==0)
                neighbors.push(edge.endVertex);
        });
        return neighbors;

    }



    removeVertex(vertexName) {
        if (this.vertexes.has(vertexName)) {
            this.vertexes.delete(vertexName);
            Array.from(this.edges.keys()).forEach(edgename=>{
                if(edgename.includes(vertexName))this.edges.delete(edgename);})
            return 'Vertex removed successfully'
        } else return 'Vertex does not exist';
    }

    removeEdge(startVertexName, endVertexName) {
        let edgeName = startVertexName.concat(endVertexName);
        if (this.edges.has(edgeName))this.edges.delete(edgeName);
        if(this.notDirected){
            edgeName=reverseString(edgeName);
            this.edges.delete(edgeName);
        }
    }

    getEdgeCost(startVertexName, endVertexName) {
        let edgeName = startVertexName.concat(endVertexName);
        if (this.edges.has(edgeName)) return this.edges.get(edgeName).cost;
        return 0;
    }

    getVertex(vertexName) {
        if (this.vertexes.has(vertexName)) return this.vertexes.get(vertexName);
        return 'Vertex does not  exist';
    }

    getEdge(startVertexName, endVertexName) {
        let edgeName = startVertexName.concat(endVertexName);
        if (this.edges.has(edgeName)) return this.edges.get(edgeName);
        return 'Edge does not exist';
    }



    getAdjacencyMatrix() {
        const matrix = [];
        for (let key1 of this.vertexes.keys()) {
            matrix[key1] = [];
            for (let key2 of this.vertexes.keys()) {
                let cost = this.getEdgeCost(key1, key2);
                if (cost) {
                    matrix[key1][key2] = cost;
                } else {
                    matrix[key1][key2] = 0;
                }
            }
        }
        return matrix;
    }

    reverseDirection() {
        if (this.notDirected) return 'Graph is not directed';
        let reversedEdges = new Map();
        Array.from(this.edges.keys()).forEach(edgeName=>{
            let edgeBuffer=this.edges.get(edgeName);
            reversedEdges.set(reverseString(edgeName),edgeBuffer);
        });
        Array.from(reversedEdges.values()).forEach(edge => {
            let vertexBuffer = edge.startVertex;
            edge.startVertex=edge.endVertex;
            edge.endVertex=vertexBuffer;
        });

        return this.edges=reversedEdges;

    }
}
function reverseString(str) {
    return str.split("").reverse().join("");
}

class Vertex {

    name;

    constructor(vertexName) {
        this.name = vertexName;
    }

}

class Edge {

    cost;
    startVertex;
    endVertex;

    constructor(startVertex, endVertex, cost) {
        this.cost = cost;
        this.startVertex = startVertex;
        this.endVertex = endVertex;
    }
}