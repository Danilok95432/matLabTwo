import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { solveTransportProblem } from './helpers/transport'

interface TransportProblem {
    supply: number[];
    demand: number[];
    costs: number[][];
}

function App() {
  const [count, setCount] = useState(0)

  const problem: TransportProblem = {
    supply: [20, 30, 50],
    demand: [30, 30, 40],
    costs: [
        [8, 6, 10],
        [9, 4, 8],
        [3, 6, 7],
    ],
};

const solution = solveTransportProblem(problem);
console.log("Распределение:", solution.allocation);
console.log("Общая стоимость:", solution.totalCost);
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
