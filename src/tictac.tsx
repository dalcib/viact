import { memo } from 'react'
//import ReactDOM from 'react-dom'
import './styles.css'
import { proxy} from 'valtio'
import { useStore } from './useStore.js'

class TicTac {
  _player1 = 'X'
  lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]] // prettier-ignore
  history = [Array(9).fill(null)]
  stepNumber = 0
  set player1(player: string) {
    this._player1 = player
  }
  get player1() {
    return this._player1
  }
  get currentSquares() {
    return this.history[this.stepNumber]
  }
  get nextValue() {
    const xSquaresCount = this.currentSquares.filter((r) => r === this.player1).length
    const oSquaresCount = this.currentSquares.filter((r) => r === 'O').length
    return oSquaresCount === xSquaresCount ? this.player1 : 'O'
  }
  get status() {
    return this.winner
      ? `Winner: ${this.winner}`
      : this.currentSquares.every(Boolean)
      ? `Scratch: Cat's game`
      : `Next player: ${this.nextValue}`
  }
  get winner() {
    for (let i = 0; i < this.lines.length; i++) {
      const [a, b, c] = this.lines[i]
      if (
        this.currentSquares[a] &&
        this.currentSquares[a] === this.currentSquares[b] &&
        this.currentSquares[a] === this.currentSquares[c]
      ) {
        return this.currentSquares[a]
      }
    }
    return null
  }
  selectSquare(square: number) {
    if (this.winner || this.currentSquares[square]) {
      return
    }
    const squares = [...this.currentSquares]
    squares[square] = this.nextValue
    this.history.push(squares)
    this.stepNumber = this.stepNumber + 1
  }
  setStepNumber(number: number) {
    this.stepNumber = number
  }
  reset() {
    this.history = [[null, null, null, null, null, null, null, null, null]]
    this.stepNumber = 0
  }
}

const store = proxy(new TicTac())

const Square = memo(({ i }) => {
  const snapshot = useStore(store)
  return (
    <button className="square" onClick={() => snapshot.selectSquare(i)}>
      {snapshot.currentSquares[i]}
    </button>
  )
})

function Game() {
  const snapshot = useStore(store)
  return (
    <div style={{ padding: 30, display: 'grid' }}>
      <h1>valtio - Tic Tac</h1>
      <div className="game">
        <div className="game-board">
          <div>
            <div className="board-row">
              <Square i={0} />
              <Square i={1} />
              <Square i={2} />
            </div>
            <div className="board-row">
              <Square i={3} />
              <Square i={4} />
              <Square i={5} />
            </div>
            <div className="board-row">
              <Square i={6} />
              <Square i={7} />
              <Square i={8} />
            </div>
          </div>
        </div>
        <div className="game-info">
          <div>{snapshot.status}</div>
          <br />
          {snapshot.history.map((step, stepNumber) => (
            <li key={stepNumber}>
              <button onClick={() => snapshot.setStepNumber(stepNumber)}>
                {stepNumber ? `Go to move #${stepNumber}` : 'Go to game start'}
              </button>
            </li>
          ))}
          <br />
          <button onClick={() => snapshot.reset()}>Reset</button>
        </div>
      </div>
      <input
        name="player"
        value={snapshot.player1}
        //@ts-ignore
        onChange={(e) => (snapshot.player1 = e.target.value)}
      />
    </div>
  )
}

//const randomColour = () => "#" + ((Math.random() * 0xffffff) << 0).toString(16);
//ReactDOM.render(<Game />, document.getElementById('root'))

export default Game
