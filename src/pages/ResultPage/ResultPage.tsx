import { useSelector } from 'react-redux'
import styles from './index.module.scss'
import { RootState } from '../../store/store'
import { Container } from '../../UI/Container'
import { Row } from '../../UI/Row'
import { Cell } from '../../UI/Cell'
import { Input } from '../../UI/Input'
import { useNavigate } from 'react-router'

export const ResultPage = () => {
  const result = useSelector((state: RootState) => state.result.result)
  const objective = useSelector((state: RootState) => state.result.objective)
  console.log("Решение транспортной задачи:");
  console.log("Оптимальная матрица распределения:");
  console.table(result.plan);
  const resultValue = (objective as string) === 'maximize' ? "Максимальная прибыль: " : "Минимальные затраты: " +  result.objectiveValue
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/')
  }
  
  return(
    <div className={styles.resultPage}>
      <Container>
        {
          result.plan ?
          <>
            <h2>Матрица распределения</h2>
            {
              result.plan.map((row, index) => {
                return(
                  <Row key={index}>
                    {
                      row.map((elem, index) => {
                        return(
                          <Cell key={index}>
                            <Input type="number" value={elem} readOnly />
                          </Cell>
                        )
                      })
                    }
                  </Row>
                )
              })
            }
            <h3>Значение целевой функции</h3>
            <p>{resultValue}</p>
          </>
          :
          <p>Решение не было получено</p>
        }
        <button onClick={handleBack}>Попробовать снова</button>
      </Container>
    </div>
  )
}