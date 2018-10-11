// Class design modelled off a tic-tac-toe tutorial for ReactJS
// https://facebook.github.io/react/tutorial/tutorial.html
// and an implementation of Go in ReactJS
// https://www.codementor.io/reactjs/tutorial/beginner-tutorial-building-a-game-from-scratch

function Cell(props){
    return(
      <button className={"cubeCell" + (props.face ? ' ' + props.face : '')} style={{background: props.color}}
          onClick={ function(){ props.onClick() }  }>
          {props.value}
     </button>
    );
}


var CubeBoard = React.createClass({
  getInitialState(){
    return( {
      board: this.props.board,
      faceLength: this.props.faceLength
    });
  },

  handleClick(r,c){
    const board = this.state.board;
    const cells = board.cells;

    // Use clicks to toggle between EMPTY squares and APPLE
    // squares (otherwise, clicks on the cell do nothing)
    if (cells[r][c] == CellType.EMPTY){
      cells[r][c] = CellType.APPLE;
    } else if (cells[r][c] == CellType.APPLE){
      cells[r][c] = CellType.EMPTY;
    }

    board.cells = cells;

    this.setState({
      faceLength: this.state.faceLength,
      board: board,
    });
  },

  renderCell(r,c){
    const cells = this.state.board.cells;
    const n     = this.state.faceLength;
    var face = '';

    if ((c >= n) && (c <2*n)){
      if (r < n){
        face = 'face5';
      } else if (r >= 2*n){
        face = 'face6';
      }
    }

    if ((r >= n) && (r < 2*n)){
      face = 'face' + (Math.floor(c / n) + 1);
    }

    // Ugly hack to deal with Safari not using "arrow functions"
    //   onClick = { () => this.handleClick(r,c) } ("this" refers to the board object)
    //
    // The usual way of translating doesn't work here:
    //   onClick = { function(){ this.handleClick(r,c) } }    ('this' refers to function here =( )
    // need variable to pass in
    //
    // All other major browsers deal with this just fine.

    //i.e. because of Safari, cannot use :
    //return <Cell value={cells[r][c]} onClick={ () => this.handleClick(r,c)  } face={face} key={(r,c)} />;

    var that = this;
    return <Cell value={cells[r][c]} onClick={ function(){ return(that.handleClick(r,c)) }  } face={face} key={(r,c)} />;

  },

  processMovement(cmd){
    var board = this.state.board;
    board.process(cmd);
    this.setState({
      faceLength: this.state.faceLength,
      board: board,
    });
  },

  render(){
    var n = this.state.faceLength;
    var board = this.state.board;
    var cells = board.cells;
    var rows = [];

    // Needed for Safari
    var that = this;

    for (var r = 0; r < 3*n; ++r){
      //Everyone EXCEPT Safari can do this
      // var rowOfCells = [...Array(4*n)].map((v,i) => this.renderCell(r,i));

      //Compatible across all browsers, uses "that" (see previous comment)
      var rowOfCells = [...Array(4*n)].map( function(v,i){ return (that.renderCell(r,i)); } );
       rows.push(<div className="cell-row" key={'ROW' + r}>{rowOfCells}</div>);
    }

    return (
      <div className="cubeContainer">
        <div className = "cubeNet" onKeyPress={this.handleKeyPress}>
          {rows}

          <div>
            <button onClick={function(){ return(that.processMovement('L'));} } id="leftTurn" className="bigButton"> Turn Left</button>
            <button onClick={function(){ return(that.processMovement('F'));} } id="forward" className="bigButton"> Move Forward </button>
            <button onClick={function(){ return(that.processMovement('R'));} } id="rightTurn" className="bigButton"> Turn Right </button>
          </div>
        </div>
      </div>
    );
  }

});

//--------

var myBoard = new Board(4);

ReactDOM.render(
  <CubeBoard faceLength={4} board={myBoard}/>,
  document.getElementById('container')
);
