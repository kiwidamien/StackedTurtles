/*
 * board.js - implements the wrapping and moving functions for the
 *            snake.
 */

// Modified from Mike James's Deque function
//http://www.i-programmer.info/programming/javascript/1674-javascript-data-structures-stacks-queues-and-deques.html
var Deque = function(my_array)
{
 this.stac = my_array.slice();
 this.popback=function(){
  return this.stac.pop();
 }
 this.pushback=function(item){
  this.stac.push(item);
 }
 this.popfront=function(){
  return this.stac.shift();
 }
 this.pushfront=function(item){
  this.stac.unshift(item);
 }
}

var CellType = {
  EMPTY: '_', APPLE: 'o', SNAKE: '*', NOTEXIST: ' ', DEAD: 'x'
};

var direction = {
  UP: 0, RIGHT: 1, DOWN: 2, LEFT:3, STR:"^>v<"
}

var Board = function(size){
  this.faceLength = size;
  this.cells = this.reset();
  this.head_dir = direction.RIGHT;
  this.ref_dir  = direction.RIGHT;
  this.isAlive  = true;
};

Board.prototype.reset = function(){
  // Now put in the empty cells
  var size = this.faceLength;

  // This creates a 3*size by 4*size array of spaces
  newBoard = [...Array(3*size)].map( function(v,i){ return (Array(4*size).fill(CellType.NOTEXIST)) } );

  for (var row = 0; row < 3*size; ++row){
    var minCol = ( (row < size) || (row >=2*size) ) ? size : 0;
    var maxCol = 4*size - 2*minCol;
    for (var col = minCol; col < maxCol; ++col){
        newBoard[row][col] = CellType.EMPTY;
    }
  }

  // Place the snake with three units on "Face 2"
  var iniRow = Math.floor(3*size/2);
  newBoard[iniRow][size    ] = '*';
  newBoard[iniRow][size + 1] = '*';
  newBoard[iniRow][size + 2] = '>';

  this.snake_pos = new Deque( [ [iniRow, size+2], [iniRow, size+1], [iniRow,size] ] );

  return (newBoard);
};

Board.prototype.move = function(r,c,dir){
    //dir are still 0 - 3, corresponding to ^>v<
    var n = this.faceLength;
    var UP = 0;
    var RIGHT = 1;
    var DOWN = 2;
    var LEFT = 3;

    /*
    # wrapping occurs on rows 0 when going up,
    #                                          n when going up (on faces 1,3,4),
    #                                          2n-1 when going down (on faces 1,3,4),
    #                                          and 3n-1 when going down.
    # wrapping also occurs on columns 0 when going left,
    #                                                       4n-1 when going right,
    #                                                       n when going left (on faces 5 and 6)
    #                                                       2n-1 when going right ( on faces 5 and 6)
    */

    // deal with the transpose (simple) cases first
    if ((dir == UP) && (r == n) && (c<n)){ return [c,r,RIGHT]; }

    if ((dir == LEFT) && (c == n) && (r<n)){ return [c,r,DOWN]; }

    if ((dir == DOWN) && (r == 2*n-1) && (c>=2*n) && (c<3*n)){ return [c,r,LEFT]; }

    if ((dir == RIGHT) && (c == 2*n - 1) && (r>=2*n)){ return [c,r,UP]; }

    /*
    # These are the two messy cases of leaving row 0 to the rightmost face, or leaving the bottom row for the rightmost face
    # (and the inverses of these movements. In both cases, you move between faces by going UP (!) )
    # First leaving the top row.
    */
    if ((dir == UP) && ((r == 0) || ((r == n) && (c >=3*n)))){
        return [n - r, 5*n - c - 1 , DOWN];  //# n-r is 0 ir r = n, and n if r = 0. Allows us to toggle
      }
    //# Now leaving the bottom row. You move between faces 6 and 4 by moving DOWN.
    if ((dir == DOWN) && ((r == 3*n - 1) || ((r == 2*n - 1) && (c >= 3*n)))){
        return [ 5*n - 2 - r, 5*n - c - 1 ,UP];
    }

    if ((dir == RIGHT) && (c == 2*n-1) && (r < n)){ return [ n, 3*n - 1 -r ,DOWN]; }

    if ((dir == UP) && (r == n) && (c >= 2*n) && (c < 3*n)){ return [ 3*n - 1 - c, 2*n-1, LEFT]; }

    if ((dir== LEFT) && (c == n) && (r >= 2*n)){ return [2*n-1,3*n-1-r,UP];}

    if ((dir == DOWN) && (r == 2*n - 1) && (c < n)){ return [3*n - 1 - c,n,RIGHT]; }

    //  # now we can just deal with the simple case
    if (dir == UP){    r = r-1 ; }
    if (dir == RIGHT){ c = c + 1; }
    if (dir == DOWN){ r = r + 1; }
    if (dir == LEFT){ c = c - 1; }

    return [r,(c + 4*n) % (4*n), dir];
  };

Board.prototype.process = function(cmd){

    if (!this.isAlive){
      return;
    }

    // deal with the rotations
    var head_dir = this.head_dir;
    var ref_dir  = this.ref_dir;
    var row_head = this.snake_pos.stac[0][0];
    var col_head = this.snake_pos.stac[0][1];

    if (cmd == 'L'){
      if (Math.abs(head_dir - 1 - ref_dir) % 4 != 2){ head_dir -= 1; }
    }
    if (cmd == 'R'){
      if (Math.abs(head_dir + 1 - ref_dir) % 4 != 2){ head_dir += 1; }
    }
    this.head_dir = (head_dir + 4) % 4;
    this.cells[row_head][col_head] = direction.STR[this.head_dir];

    if (cmd == 'F'){
      var moveTo = this.move(row_head, col_head, this.head_dir);
      var new_row_head = moveTo[0];
      var new_col_head = moveTo[1];
      this.ref_dir = moveTo[2];

      this.head_dir = this.ref_dir;
      var newCellContains = this.cells[new_row_head][new_col_head];

      if (newCellContains == CellType.SNAKE){
        // snake dies. Do cleanup
        this.isAlive = false;
        while (this.snake_pos.stac.length){
          var old_tail = this.snake_pos.popback();
          this.cells[old_tail[0]][old_tail[1]] = CellType.DEAD;
        }
        return;
      }

      if (newCellContains == CellType.EMPTY){
        var old_tail = this.snake_pos.popback();
        this.cells[old_tail[0]][old_tail[1]] = CellType.EMPTY;
      }

      // Move the head
      this.cells[row_head][col_head] = CellType.SNAKE;
      this.snake_pos.pushfront([new_row_head, new_col_head]);
      this.cells[new_row_head][new_col_head] = direction.STR[this.head_dir];
    }

}
