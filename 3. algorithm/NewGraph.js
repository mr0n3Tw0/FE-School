class NewGraph {

    constructor(notDirected) { // true - обычный граф, false - направленный
        this.notDirected = notDirected;
        this.vertexes = new Map();
        this.edges = new Map();
    }


    vertexes;
    edges;
    notDirected;


    addVertex(vertexName) {//добавить вершину
        if (!this.vertexes.has(vertexName))
            this.vertexes.set(vertexName, new Vertex(vertexName));
    }

    addEdge(startVertexName, endVertexName, cost) {//добавить ребро по двум вершинам и с указанием стоимости ребра

        this.addVertex(startVertexName);
        this.addVertex(endVertexName);
        let edgeName = startVertexName.concat(endVertexName);
        if (!this.edges.has(edgeName)) {
            this.edges.set(edgeName, new Edge(startVertexName, endVertexName, cost));
            console.log(`edge ${edgeName} added`);

            if (this.notDirected) {
                edgeName = reverseString(edgeName);
                this.edges.set(edgeName, new Edge(endVertexName, startVertexName, cost));
                console.log(`edge ${edgeName} added`);
            }

        }

    }

    getNeighbours(vertexName) { //достать соседей
        if (!this.vertexes.has(vertexName)) return "vertex does not exist";
        let neighbors = [];
        Array.from(this.edges.values()).forEach(edge => {
            if (edge.startVertex.localeCompare(vertexName) === 0)
                neighbors.push(edge.endVertex);
        });
        return neighbors;

    }


    removeVertex(vertexName) { //убрать вершину
        if (this.vertexes.has(vertexName)) {
            this.vertexes.delete(vertexName);
            Array.from(this.edges.keys()).forEach(edgename => {
                if (edgename.includes(vertexName)) this.edges.delete(edgename);
            })
            return 'Vertex removed successfully'
        } else return 'Vertex does not exist';
    }

    removeEdge(startVertexName, endVertexName) {//убрать ребро
        let edgeName = startVertexName.concat(endVertexName);
        if (this.edges.has(edgeName)) this.edges.delete(edgeName);
        if (this.notDirected) {
            edgeName = reverseString(edgeName);
            this.edges.delete(edgeName);
        }
    }

    getEdgeCost(startVertexName, endVertexName) {//получить стоимость ребра
        let edgeName = startVertexName.concat(endVertexName);
        if (this.edges.has(edgeName)) return this.edges.get(edgeName).cost;
        return 0;
    }

    getVertex(vertexName) {//взять вершину
        if (this.vertexes.has(vertexName)) return this.vertexes.get(vertexName);
        return 'Vertex does not  exist';
    }

    getEdge(startVertexName, endVertexName) {//взять ребро
        let edgeName = startVertexName.concat(endVertexName);
        if (this.edges.has(edgeName)) return this.edges.get(edgeName);
        return 'Edge does not exist';
    }


    getAdjacencyMatrix() {//получить матрицу смежности
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

    reverseDirection() {//развернуть направленный граф
        if (this.notDirected) return 'Graph is not directed';
        let reversedEdges = new Map();
        Array.from(this.edges.keys()).forEach(edgeName => {
            let edgeBuffer = this.edges.get(edgeName);
            reversedEdges.set(reverseString(edgeName), edgeBuffer);
        });
        Array.from(reversedEdges.values()).forEach(edge => {
            let vertexBuffer = edge.startVertex;
            edge.startVertex = edge.endVertex;
            edge.endVertex = vertexBuffer;
        });

        return this.edges = reversedEdges;

    }

    getSubGraph(vertexNames) {// получить подграф

        let subGraph = new NewGraph(this.notDirected);
        vertexNames.forEach(vertexName => {
            if (this.vertexes.has(vertexName))
                subGraph.addVertex(vertexName);
            let newNeighbours = this.getNeighbours(vertexName)
                .filter(oldNeighbour => vertexNames.includes(oldNeighbour));
            newNeighbours.forEach(neighbourName => {
                let edgeNameBuffer = vertexName.concat(neighbourName);
                let edgeCostBuffer = this.edges.get(edgeNameBuffer).cost;
                subGraph.addEdge(vertexName, neighbourName, edgeCostBuffer);
            })
        });
        return subGraph;
    }

    getVertices(){//это для Дейкстры

        let vertices= new Map();
        Array.from(this.vertexes.keys()).forEach(vertexName=>{
            let edges = new Map();
            this.getNeighbours(vertexName).forEach(neighbour=>
            {
                let edgeName=vertexName.concat(neighbour);
                edges.set(neighbour,this.edges.get(edgeName).cost);
            });
            vertices.set(vertexName,edges);
        });
        return vertices;
    }

    getPathByDijkstra(start, finish) { //а это сам Дейкстра
        let nodes = new PriorityQueue(),
            distances = {},
            previous = {},
            path = [],
            smallest, vertex, neighbor, alt;

        let vertices = this.getVertices();

        Array.from(vertices.keys()).forEach(vertex=>{
            if(vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(0, vertex);
            }
            else {
                distances[vertex] = Infinity;
                nodes.enqueue(Infinity, vertex);
            }

            previous[vertex] = null;
        });

        while(!nodes.isEmpty()) {
            smallest = nodes.dequeue();

            if(smallest === finish) {
                path = [];

                while(previous[smallest]) {
                    path.push(smallest);
                    smallest = previous[smallest];
                }

                break;
            }

            if(!smallest || distances[smallest] === Infinity){
                continue;
            }

            Array.from(vertices.get(smallest).keys()).forEach(neighbor=> {
                alt = distances[smallest] + vertices.get(smallest).get(neighbor);

                if(alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    previous[neighbor] = smallest;

                    nodes.enqueue(alt, neighbor);
                }
            })
        }

        return path.concat([start]).reverse();
    };
}
class PriorityQueue {//тоже для Дейкстры
    _nodes = [];

    enqueue(priority, key) {
        this._nodes.push({key: key, priority: priority });
        this.sort();
    };
    dequeue() {
        return this._nodes.shift().key;
    };
    sort () {
        this._nodes.sort(function (a, b) {
            return a.priority - b.priority;
        });
    };
    isEmpty () {
        return !this._nodes.length;
    };
}

function
reverseString(str) {
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