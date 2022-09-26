class GameBoard {
  constructor () {
    this.board = this.generateBoard();
  }

  generateBoard() {
    const board = Array(8).fill(0).map((row, i) => Array(8).fill(0));
    return board;
  }
}

class Knight {
  getPossibleMoves(cord) {
    return {
      upperLeftDown: this.checkValid([cord[0] - 1, cord[1] - 2]),
      upperLeftUpper: this.checkValid([cord[0] - 2, cord[1] - 1]),
      upperRightUpper: this.checkValid([cord[0] - 2, cord[1] + 1]),
      upperRightDown: this.checkValid([cord[0] - 1, cord[1] + 2]),
      downRightUpper: this.checkValid([cord[0] + 1, cord[1] + 2]),
      downRightDown: this.checkValid([cord[0] + 2, cord[1] + 1]),
      downLeftDown: this.checkValid([cord[0] + 2, cord[1] - 1]),
      downLeftUpper: this.checkValid([cord[0] + 1, cord[1] - 2]),
    }
  }

  checkValid(cord) {
    if (cord[0] > 7 || cord[1] > 7 || cord[0] < 0 || cord[1] < 0 || cord === this.position) {
      return null;
    }

    return cord;
  }
}

class Vertex {
  constructor(position, predecessor, distance = null) {
    this.position = position;
    this.predecessor = predecessor;
    this.distance = distance;
  }
}

function isVisited(position, board) {
  return board[position[0]][position[1]] === 0 ? false : true;
}

function constructGraph(pos, piece, board) {
  const queue = [];
  const newBoard = board;
  const newVertex = new Vertex(pos, null, 0);
  queue.push(newVertex);

  while(queue.length !== 0) {
    const vertexToBeProcessed = queue.shift();
    const newPos = vertexToBeProcessed.position;
    board[newPos[0]][newPos[1]] = vertexToBeProcessed;

    const arrToVisit = Object.values(piece.getPossibleMoves(newPos))
    .filter(obj => obj !== null)
    .map((pos) => isVisited(pos, board) ? null : new Vertex(pos, vertexToBeProcessed, vertexToBeProcessed.distance + 1))
    .filter(obj => obj !== null);

    arrToVisit.forEach(newVert => queue.push(newVert));
  }
}

function shortPathDecider(pos, piece, board, result, finale) {
  result.push(pos);
  if (finale[0] === pos[0] && finale[1] === pos[1]) {
    return result;
  }
  const possibleMoves = Object.values(piece.getPossibleMoves(pos))
  .filter(obj => obj !== null);
  const possibleMovesVertex = possibleMoves.map((testPos) => board[testPos[0]][testPos[1]])
  const minimalVertex = possibleMovesVertex.reduce((vertex, nextVertex) => vertex.distance < nextVertex.distance ? vertex : nextVertex);
  return shortPathDecider(minimalVertex.position, piece, board, result, finale);
}

function knightMoves(cordX, cordY) {
  const chessBoard = new GameBoard();
  const knightPiece = new Knight();
  constructGraph(cordY, knightPiece, chessBoard.board);
  return shortPathDecider(cordX, knightPiece, chessBoard.board, [], cordY);
}

console.log(knightMoves([0, 0], [1, 1]))