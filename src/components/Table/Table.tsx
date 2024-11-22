import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { setResult } from '../../store/result';
import { useNavigate } from 'react-router';
import { ObjectiveType, TransportationProblem } from '../../helpers/transportN';
import { Cell } from '../../UI/Cell';
import { Container } from '../../UI/Container';
import { Row } from '../../UI/Row';
import styles from './index.module.scss';

interface TableProps {
  rows: number;
  columns: number;
}

interface TableData {
  costsMatrix: number[][];
  supply: number[];
  demand: number[];
}

const schema = yup.object().shape({
  costsMatrix: yup.array().of(yup.array().of(yup.number().positive().required('Поле обязательно'))),
  supply: yup.array().of(yup.number().positive().required('Поле обязательно')),
  demand: yup.array().of(yup.number().positive().required('Поле обязательно')),
});

export const Table: React.FC<TableProps> = ({ rows, columns }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm<TableData>({ // Specify type here
    resolver: yupResolver(schema),
    defaultValues: {
      costsMatrix: Array.from({ length: rows - 1 }, () => Array(columns - 1).fill(0)), // Use 0 instead of ''
      supply: Array(rows - 1).fill(0), // Use 0 instead of ''
      demand: Array(columns - 1).fill(0), // Use 0 instead of ''
    },
  });

  const onSubmit = (data: TableData) => { // Specify type here
    const objective: ObjectiveType = 'minimize';
    const tp = new TransportationProblem(data.costsMatrix, data.supply, data.demand, objective); //remove unnecessary spread operator
    const result = tp.solve();
    if (result) {
      dispatch(setResult({ result: result, objective: objective }));
      navigate('/result');
    }
  };

  const renderCell = (fieldName: string, rowIndex: number, colIndex: number) => {
    return (
      <Cell key={`${rowIndex}-${colIndex}`}>
        <Controller
          name={fieldName}
          control={control}
          render={({ field }) => (
            <input {...field} type="number" style={{ width: '80px', height: '80px', textAlign: 'center', fontSize: '18px' }} />
          )}
        />
        {errors[fieldName as keyof TableData]?.[rowIndex]?.[colIndex] && (
          <span style={{ color: 'red' }}>{errors[fieldName as keyof TableData][rowIndex][colIndex]?.message}</span>
        )}
      </Cell>
    );
  };

  // Генерация таблицы
  return (
    <form className={styles.tableForm} onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Row>
          {Array.from({ length: columns }, (_, colIndex) => (
            <Cell key={`header-${colIndex}`} style={{ fontWeight: 'bold' }}>
              {colIndex === columns - 1 ? 'Запасы' : `Столбец ${colIndex + 1}`}
            </Cell>
          ))}
        </Row>
        {Array.from({ length: rows - 1 }, (_, rowIndex) => (
          <Row key={`row-${rowIndex}`}>
            {Array.from({ length: columns - 1 }, (_, colIndex) => renderCell(`costsMatrix[${rowIndex}][${colIndex}]`, rowIndex, colIndex))}
            {renderCell(`supply[${rowIndex}]`, rowIndex, columns - 1)}
          </Row>
        ))}
        <Row>
          {Array.from({ length: columns - 1 }, (_, colIndex) => renderCell(`demand[${colIndex}]`, rows - 1, colIndex))}
          <Cell /> {/* Empty last cell */}
        </Row>
      </Container>
      {Object.entries(errors).map(([key, value]) => (
        <div key={key} style={{ color: 'red' }}>{key}: {value.message}</div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};
