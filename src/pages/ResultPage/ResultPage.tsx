import { useSelector } from 'react-redux'
import styles from './index.module.scss'
import { RootState } from '../../store/store'

export const ResultPage = () => {
  const result = useSelector((state: RootState) => state.result.result)
  const objective = useSelector((state: RootState) => state.result.objective)
  console.log("Решение транспортной задачи:");
  console.log("Оптимальная матрица распределения:");
  console.table(result.plan);
  console.log((objective as string) === 'maximize' ? "Максимальная прибыль:" : "Минимальные затраты:", result.objectiveValue);
  return(
    <div className={styles.resultPage}>

    </div>
  )
}