// CANVAS
var squareId = 1;
var grid = [];
let dimension = null;
grid.squares = [];

var draggedSquares = [];

function drawCanvas(data) {
  dimension = parseInt(data.dimension);
  localStorage.setItem("tableId", data.tableId);

  for (var x = 0; x < dimension; x++) {
    grid[x] = [];
  }

  var i = 0;
  while (!isFull(grid) && i++ < 1000) {
    let sq = addSquare(grid);
    if (!sq) {
      removeSquare(grid);
    }
  }

  var canvas = $("#canvas").get(0);

  canvas.width = dimension * 50;
  canvas.height = dimension * 50;

  var context = canvas.getContext("2d");

  updateCanvas(context, dimension);
  $(".gameCanvas").append(canvas);
  socket.emit("CREATE_BOARD", { board: grid.squares });
}

function updateCanvas(context, dimension) {
  // clear canvas
  context.fillStyle = "white";
  context.fillRect(0, 0, dimension * 50, dimension * 50);

  // user dragged squares
  for (var i = 0; i < draggedSquares.length; i++) {
    var square = draggedSquares[i];
    context.fillStyle = "#ccc";
    context.fillRect(
      3 + square.x * 50,
      3 + square.y * 50,
      square.width * 50 - 6,
      square.height * 50 - 6
    );
  }

  // grid
  for (var x = 0; x < dimension; x++) {
    for (var y = 0; y < dimension; y++) {
      context.strokeRect(0.5 + x * 50, 0.5 + y * 50, 50, 50);
    }
  }

  context.fillStyle = "black";
  context.textAlign = "center";
  for (var i = 0; i < grid.squares.length; i++) {
    var square = grid.squares[i];
    var textX = square.pos.x + square.textPos.x;
    var textY = square.pos.y + square.textPos.y;
    var surface = square.pos.width * square.pos.height;
    context.fillText(surface, 25.5 + textX * 50, 25.5 + textY * 50);
  }
}

var dragContext = null;
function canvasMouseDown(e) {
  if (!isPaused) {
    var x = Math.floor(e.offsetX / 50);
    var y = Math.floor(e.offsetY / 50);

    const isAlreadySelected = draggedSquares.some(
      (square) => square.x === x && square.y === y
    );

    if (!isAlreadySelected) {
      var square = { x: x, y: y, width: 1, height: 1 };
      draggedSquares.push(square);
      dragContext = { index: draggedSquares.length - 1 };
      $("#canvas").on("mousemove", drag);
    }
  }
}

function canvasMouseUp(e) {
  if (!isPaused) {
    dragContext = null;
    $(this).off("mousemove");
  }
}

$("#canvas").on("mousedown", canvasMouseDown);
$("#canvas").on("mouseup", canvasMouseUp);

function drag(e) {
  var square = draggedSquares[dragContext.index];
  var x = Math.ceil(e.offsetX / 50);
  var y = Math.ceil(e.offsetY / 50);
  square.width = x - square.x;
  square.height = y - square.y;
  var context = this.getContext("2d");
  updateCanvas(context, dimension);
}

function getColor(value) {
  var color = (value * 1777781) % 16777213;
  var hex = color.toString(16);
  while (hex.length < 6) {
    hex += "0";
  }
  return hex;
}

function isFull(grid) {
  for (var x = 0; x < dimension; x++) {
    for (var y = 0; y < dimension; y++) {
      if (!grid[x][y]) {
        return false;
      }
    }
  }
  return true;
}

function addSquare(grid) {
  do {
    var x = Math.floor(Math.random() * dimension);
    var y = Math.floor(Math.random() * dimension);
  } while (grid[x][y]);

  var rect = { x: x, y: y, width: 1, height: 1 };
  for (var i = 0; i < 6; i++) {
    newRect = expandRect(grid, rect);
    if (!newRect) {
      if (i == 0) {
        return false;
      }
      break;
    }
    rect = newRect;
  }

  addGridRect(grid, rect, squareId++);

  return true;
}

function removeSquare(grid) {

  var squareIndex = Math.floor(grid.squares.length * Math.random());
  var square = grid.squares[squareIndex];

  for (var i = 0; i < square.pos.width; i++) {
    for (var j = 0; j < square.pos.height; j++) {
      var x = square.pos.x + i;
      var y = square.pos.y + j;
      grid[x][y] = null;
    }
  }
  grid.squares.splice(squareIndex, 1);
}

function addGridRect(grid, rect, squareId) {
  var textPos = {
    x: Math.floor(Math.random() * rect.width),
    y: Math.floor(Math.random() * rect.height),
  };
  var square = { id: squareId, textPos: textPos, pos: rect };
  grid.squares.push(square);
  for (var x = 0; x < rect.width; x++) {
    for (var y = 0; y < rect.height; y++) {
      grid[x + rect.x][y + rect.y] = square;
    }
  }
  grid.squares.forEach((square) => {
    square.selected = false;
  });
}

function expandRect(grid, rect) {
  dir = ["top", "left", "right", "down"];
  shuffle(dir);
  for (var i = 0; i < dir.length; i++) {
    res = expandRectDir(grid, rect, dir[i]);
    if (res) {
      return res;
    }
  }
  return null;
}

function expandRectDir(grid, rect, dir) {
  if (dir == "top" && rect.y > 0) {
    newRect = {
      x: rect.x,
      y: rect.y - 1,
      width: rect.width,
      height: rect.height + 1,
    };
    if (isEmpty(grid, newRect)) {
      return newRect;
    }
  }
  if (dir == "left" && rect.x > 0) {
    newRect = {
      x: rect.x - 1,
      y: rect.y,
      width: rect.width + 1,
      height: rect.height,
    };
    if (isEmpty(grid, newRect)) {
      return newRect;
    }
  }
  if (dir == "down" && rect.y + rect.height < 5) {
    newRect = {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height + 1,
    };
    if (isEmpty(grid, newRect)) {
      return newRect;
    }
  }
  if (dir == "right" && rect.x + rect.width < 5) {
    newRect = {
      x: rect.x,
      y: rect.y,
      width: rect.width + 1,
      height: rect.height,
    };
    if (isEmpty(grid, newRect)) {
      return newRect;
    }
  }

  return null;
}

function isEmpty(grid, rect) {
  var width = rect.width;
  var height = rect.height;
  var x = rect.x;
  var y = rect.y;
  for (var left = 0; left < width; left++) {
    for (var top = 0; top < height; top++) {
      if (grid[x + left][y + top]) {
        return false;
      }
    }
  }
  return true;
}

function shuffle(o) {
  //v1.0
  for (
    var j, x, i = o.length;
    i;
    j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
  );
  return o;
}

// Function to check if all squares are filled
function areAllSquaresSelected() {
  const gridSquares = grid.squares;
  if (gridSquares.length === draggedSquares.length) {
    let totalSum = 0;
    for (let i = 0; i < gridSquares.length; i++) {
      const gridSquarePos = gridSquares[i].pos;

      for (let i = 0; i < draggedSquares.length; i++) {
        const selectedSquare = draggedSquares[i];

        if (
          gridSquarePos.width === selectedSquare.width &&
          gridSquarePos.height === selectedSquare.height
        ) {
          totalSum += gridSquarePos.width * gridSquarePos.height;
        }
      }
    }

    if (totalSum === dimension * dimension) {
      return true;
    } else {
      totalSum = 0;
      for (let i = 0; i < draggedSquares.length; i++) {
        const selectedSquare = draggedSquares[i];
        totalSum += selectedSquare.width * selectedSquare.height;
      }

      if (totalSum === dimension * dimension) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
}

// Add event listener to the submit button
$("#submitBtn").click(function () {
  if (areAllSquaresSelected()) {
    // All squares are selected, handle submission
    const tableId = localStorage.getItem("tableId");
    const boardId = localStorage.getItem("boardId");
    const totalTime = document.querySelector("#timer").innerText;
    socket.emit("SUBMIT", { tableId, boardId, totalTime });
  } else {
    // Not all squares are selected, display an error message
    alert("Invalid selection!");
  }
});

// Clear All selected square
function clearAllSelectedSquares() {
  draggedSquares = [];
  updateCanvas($("#canvas").get(0).getContext("2d"), dimension);
}
$("#clearButton").click(clearAllSelectedSquares);
