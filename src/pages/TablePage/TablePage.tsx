import { Table } from '../../components/Table/Table'
import styles from './index.module.scss'

export const TablePage = () => {
  return(
    <div className={styles.tablePage}>
      <Table rows={4} columns={4}/>
    </div>
  )
}