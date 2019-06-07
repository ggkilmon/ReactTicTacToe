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
    renderSquare(i) {
        return (
            <Square 
                key={i}
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderBoardRow(squares){
        return (
            <div className="board-row">
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
                items.push(this.renderSquare(count++));
            }
            rows.push(this.renderBoardRow(items));
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
        };
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = getNext(this.state.xIsNext);
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            selectedHistory: history.length,
            xIsNext: !this.state.xIsNext,
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
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                Constants.MSG_GOTO.replace("$place", "move #" + move) :
                Constants.MSG_GOTO.replace("$place", "game start");
            
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
            status = Constants.MSG_NEXT.replace("$player", getNext(this.state.xIsNext));
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
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
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return squares[a];
        }
    }

    return null;
}

function getNext(isX){
    return isX ? 'X' : 'O';
}