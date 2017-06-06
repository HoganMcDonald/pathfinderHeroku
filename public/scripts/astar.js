//variables
var grid = [];
var openSet = [];
var closedSet = [];
var rows = 6;
var columns = 6;

$(document).ready(function() {
  //populate grid with Node objects
  fillGrid(grid);
  assignNeighbors(grid);

  //on DOM
  //toggle class for div and toggle status for Nodes
  $('.node').on('click', toggleStatus);
  //refresh page when reset is clicked
  $('.reset').on('click', function() {
    location.reload();
  });
  $('.run').on('click', aStar);
});

//Node constructor function
var Node = function(row, column, index) {
  this.row = row;
  this.column = column;
  this.gValue = 999;
  this.hValue = 0;
  this.fValue = 0;
  this.status = true;
  //index number cooresponding to div number on DOM
  this.index = index;
  this.neighbors = [];

  //add all neighbors to neighbors
  this.addNeighbors = function() {
    var x = this.row;
    var y = this.column;
    if (x < columns) {
      //bottom
      this.neighbors.push(grid[x + 1][y]);
    }
    if (x < columns && y < rows) {
      //bottom right
      this.neighbors.push(grid[x + 1][y + 1]);
    }
    if (y < rows) {
      //right
      this.neighbors.push(grid[x][y + 1]);
    }
    if (x > 0 && y < rows) {
      //top right
      this.neighbors.push(grid[x - 1][y + 1]);
    }
    if (x > 0) {
      //top
      this.neighbors.push(grid[x - 1][y]);
    }
    if (x > 0 && y > 0) {
      //top left
      this.neighbors.push(grid[x - 1][y - 1]);
    }
    if (y > 0) {
      //left
      this.neighbors.push(grid[x][y - 1]);
    }
    if (x < columns && y > 0) {
      //bottom left
      this.neighbors.push(grid[x + 1][y - 1]);
    }
  }; //end addNeighbors
  this.calcF = function() {
    this.fValue = this.gValue + this.hValue;
  };
  this.calcH = function() {
    this.hValue = Math.abs((this.row - 6) + (this.column) - 6);
  };
}; //end Node constructor

//fill grid with array of arrays where grid[row][column]
var fillGrid = function(arr) {
  //row
  for (var i = 0; i <= rows; i++) {
    arr[i] = [];
    //column
    for (var j = 0; j <= columns; j++) {
      arr[i][j] = new Node(i, j, (i * (columns + 1)) + j);
      arr[i][j].calcH();
    }
  }
}; //end fill grid

//populates .neighbors for each node
var assignNeighbors = function(arr) {
  for (var i = 0; i <= rows; i++) {
    for (var j = 0; j <= columns; j++) {
      arr[i][j].addNeighbors();
    }
  }
}; //end assign neighbors

var removeFromArray = function(array, element) {
  for (var i = array.length - 1; i <= 0; i--) {
    if (array[i] == element) {
      array.splice(i, 1);
    }
  }
};

//changes the stauts of Node to false when clicked vice-versa
var toggleStatus = function() {
  $(this).toggleClass('nodeNull');
  //searches for node in grid with same index as div and toggles its status so null = false
  for (var i = 0; i <= rows; i++) {
    for (var j = 0; j <= columns; j++) {
      if ($(this).index() === grid[i][j].index) {
        grid[i][j].status = !grid[i][j].status;
        console.log(grid[i][j]);
      }
    }
  }
}; //end toggle status

//delivers the distance between two neighbor nodes
var findGForNeighbor = function(node, nodeNeighbor) {
  var tempG = 0;
  //if diagonal to node
  if ((nodeNeighbor.row != node.row) && (nodeNeighbor.column != node.column)) {
    tempG = 14;
    //if neighbor is adjacent to node
  } else {
    tempG = 10;
  }
  return tempG;
}; //end find G - returns g of current node plus distance to neighbor

var updateDisplay = function() {
  for (var i = 0; i < openSet.length; i++) {
    $('.node').eq(openSet[i].index).addClass('openSet');
  }
  for (var i = 0; i < closedSet.length; i++) {
    $('.node').eq(closedSet[i].index).addClass('closedSet');
  }
};

//find the lowest fValue in any array
var findLowestF = function(arr) {
  //running lowest
  var lowestF = 9999;
  var lowestI = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].fValue < lowestF) {
      lowestF = arr[i].fValue;
      lowestI = i;
    }
  }
  return lowestI;
}; //end find lowest f - returns index of lowest f

//removes a particular element from an array
var removeFromArray = function(array, element) {
  for (var i = array.length - 1; i >= 0; i--) {
    if (array[i].index === element.index) {
      array.splice(i, 1);
    }
  }
}; //end remove from array

//checks if an element with matchin index is in an array
var checkIfIn = function(array, element) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].index === element.index) {
      return true;
    }
  }
  return false;
};

var aStar = function() {
  //diable the run button
  $(this).hide();
  //establish the start and end
  var start = grid[0][0];
  start.gValue = 0;
  var end = grid[6][6];
  openSet.push(start);
  console.log(grid[0][0]);
  updateDisplay();

  //current is the node currently being evaluated
  var current = start;
  //loop while openSet.length > 0 because if all nodes have been evaluated and no end has been found there is no path
  //  either return when end is found
  // return placed after the loop that alerts the user that there was no end

  while (openSet.length > 0) {

    //let current be the node in openSet with the lowest fValue
    current = openSet[findLowestF(openSet)];
    closedSet.push(current);
    //remove from openSet the node whose index matches that of current
    removeFromArray(openSet, current);
    console.log(openSet);
    if (current == end) {
      console.log('path found');
      break;
    }
    //loop through current nodes neighbors
    for (var i = 0; i < current.neighbors.length; i++) {
      var neighbor = current.neighbors[i];
      //filter out non-traversable nodes and closed set nodes
      if (neighbor.status && !checkIfIn(closedSet, neighbor)) {
        console.log(neighbor);
        //if potential path to node is lower than existing path
        //push neighbors to open set
        openSet.push(neighbor);
        //if current path to them is less than previous path
        if (neighbor.gValue < current.gValue + findGForNeighbor(current, neighbor)) {
          //  find g and f values for them
          neighbor.gValue = current.gValue + findGForNeighbor(current, neighbor);
          //  assign their parents as current
          neighbor.parent = current;
          neighbor.calcF();
        }


        updateDisplay();
      }


    }


  }

  current = end;
  while (current.parent) {
    $('.node').eq(current.index).addClass('path');
    current = current.parent;
  }
  $('.node').eq(0).addClass('path');
};
