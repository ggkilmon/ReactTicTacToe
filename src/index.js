import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as Constants from './constants'


function Square(props){
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i, row, column) {
        return (
            <Square 
                key={i}
                value={this.props.squares[i] ? this.props.squares[i].value : ''} 
                onClick={() => this.props.onClick(i, row, column)}
            />
        );
    }

    renderBoardRow(squares, row){
        return (
            <div className="board-row">
                <div className="rowLabel">{row}</div>
                {squares}
            </div>
        );
    }

    render() {
        let items = [];
        let rows = [];
        let count = 0;
        for (let j = 0; j < 3; j++){
            for (let i = 0; i < 3; i++){
                items.push(this.renderSquare(count++, j, i));
            }
            rows.push(this.renderBoardRow(items, j + 1));
            items = [];
        }

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            selectedHistory: 0,
            stepNumber: 0,
            xIsNext: true,
            lastMove: 0,
        };
    }

    handleClick(i, row, column){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = getNext(this.state.xIsNext, row, column);
        this.setState({
            history: history.concat([{
                squares: squares,
                lastMove: i,
            }]),
            stepNumber: history.length,
            selectedHistory: history.length,
            xIsNext: !this.state.xIsNext,
            lastMove: i,
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            selectedHistory: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const selectedHistory = this.state.selectedHistory;
        const step = this.state.stepNumber;
        const current = history[step];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const historySquare = move > 0 ? history[move].squares[history[move].lastMove] : "";
            const desc = move ?
                Constants.MSG_GOTO
                    .replace("$place", "move #" + move)
                    .replace("$player", historySquare.value)
                    .replace("$row", historySquare.row + 1)
                    .replace("$column", historySquare.column + 1) :
                Constants.MSG_GAMESTART;
            
            const buttonClass = selectedHistory === move ? "boldButton" : "normalButton";
            
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} className={buttonClass}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner){
            status = Constants.MSG_WINNER.replace("$winner", winner);
        }else{
            if (step === 9){
                status = Constants.MSG_DRAW;
            }else{
                status = Constants.MSG_NEXT.replace("$player", getNext(this.state.xIsNext, 0, 0).value);
            }
        }

        return (
            <div className="game">
                <div className="game-board">
                    <div className="columnLabel">
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                    </div>
                    <Board 
                        squares={current.squares}
                        onClick={(i, row, column) => this.handleClick(i, row, column)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}
  
// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares){
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++){
        const [a, b, c] = lines[i];
        if (squares[a] && squares[b] && squares[c] && squares[a].value === squares[b].value && squares[a].value === squares[c].value){
            return squares[a].value;
        }
    }

    return null;
}

function getNext(isX, row, column){
    let x = 
        {
            value: 'X',
            row: row,
            column: column
        };
    let o = 
        {
            value: 'O',
            row: row,
            column: column
        };
    return isX ? x : o;
}