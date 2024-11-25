import { useState } from 'react';
import { Table } from '../../components/Table/Table'
import styles from './index.module.scss'

export const TablePage = () => {

  const [rows, setRows] = useState<number>(0);
  const [columns, setColumns] = useState<number>(0);

  const handleRowsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRows = parseInt(event.target.value) || 0;
    setRows(newRows);
  };

  const handleColumnsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColumns = parseInt(event.target.value) || 0;
    setColumns(newColumns);
  };

  return(
    <div className={styles.tablePage}>
      <h1>Решение транспортной задачи</h1>
      <h5>Заполните таблицу(нижняя строка - потребности)</h5>
      <div className={styles.inputs}>
        <div className={styles.inputWrapper}>
          <label>Количество строк:</label>
          <input
            type="number"
            value={rows}
            onChange={handleRowsChange}
            min="1"
          />
        </div>
        <div className={styles.inputWrapper}>
          <label>Количество столбцов:</label>
          <input
            type="number"
            value={columns}
            onChange={handleColumnsChange}
            min="1"
          />
        </div>
      </div>
      {rows > 0 && columns > 0 && (
        <Table rows={rows} columns={columns} />
      )}
    </div>
  )
}