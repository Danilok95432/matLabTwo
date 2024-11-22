import './App.css'
import { ResultPage } from './pages/ResultPage/ResultPage'
import { TablePage } from './pages/TablePage/TablePage'
import { Routes, Route } from 'react-router'

function App() {

  return (
    <Routes>
      <Route path='/' element={<TablePage />}/>
      <Route path='/result' element={<ResultPage />} />
    </Routes>
  )
}

export default App
