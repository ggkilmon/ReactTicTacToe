import React from 'react';
import Square from './square';

class Board extends React.Component {
    renderSquare(i, row, column) {
        let className = "square";
        let line = this.props.winningLine;
        if (line && line.includes(i)){
            className += " winner";
        }

        return (
            <Square 
                key={i}
                value={this.props.squares[i] ? this.props.squares[i].value : ''} 
                onClick={() => this.props.onClick(i, row, column)}
                className={className}
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

    generateRows(){
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

        return rows;
    }

    render() {
        let rows = this.generateRows();

        return (
            <div>
                {rows}
            </div>
        );
    }
}

export default Board;