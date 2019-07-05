import React from 'react';
import Util from './utils';
import Board from './board';
import * as Constants from './constants'

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
            historySortAsc: true,
        };
    }

    handleClick(i, row, column){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (Util.calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = Util.getNext(this.state.xIsNext, row, column);
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

    sortHistory(historySortAsc){
        this.setState({
            historySortAsc: !historySortAsc,
        })
    }

    renderHistory(history, selectedHistory, move){
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
    }

    render() {
        const history = this.state.history;
        const selectedHistory = this.state.selectedHistory;
        const step = this.state.stepNumber;
        const current = history[step];
        const winner = Util.calculateWinner(current.squares);
        let moves = history.map((step, move) => { return this.renderHistory(history, selectedHistory, move); });
        let status = Util.getStatus(step, winner, this.state.xIsNext);
        
        let sortHistoryDesc = Constants.MSG_SORT.replace("$direction", "Descending");
        if (!this.state.historySortAsc){
            moves = moves.reverse();
            sortHistoryDesc = Constants.MSG_SORT.replace("$direction", "Ascending");
        }
        let winningLines = null;
        if (winner){
            winningLines = winner.line;
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
                        winningLine={winningLines}
                        onClick={(i, row, column) => this.handleClick(i, row, column)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div><button onClick={() => this.sortHistory(this.state.historySortAsc)}>{sortHistoryDesc}</button></div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

export default Game;