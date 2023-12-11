import React, { useState } from 'react';

import { Button, DatePicker, Icon, Input, Select } from 'k6-ui/v2';
import { DeleteIcon } from 'k6-ui/v2/assets/icons';

import classes from './form.module.css';

interface FormI {
  naming: string;
  status: string;
  importance: number;
}

export const Form = ({ naming, status, importance }: FormI) => {
  const [expanded, setExpanded] = useState(false);
  const [inputData, setInputData] = useState({
    [naming + ' naming']: '',
    [naming + ' duration']: '',
    [naming + ' executor']: '',
    [naming + ' importance']: '',
    [naming + ' annotation']: '',
  });
  const [planDateStart, setPlanDateStart] = useState(new Date());
  const [planDateEnd, setPlanDateEnd] = useState(new Date());
  const [factDateStart, setFactDateStart] = useState(new Date());
  const [factDateEnd, setFactDateEnd] = useState(new Date());

  const [selectData, setSelectData] = useState([{ label: '', value: '' }]);

  const handleInputChange = (event: any) => {
    const { id, value, name } = event.target;
    console.log(value, name);
    setInputData(prevInputData => ({ ...prevInputData, [id]: value }));
  };

  const handleClearInput = (inputName: string) => {
    setInputData(prevInputData => ({ ...prevInputData, [inputName]: '' }));
  };

  const color: any = {
    Запланировано: '#2975b4',
    Просрочено: 'gray',
    Завершено: 'red',
  };
  return (
    <>
      <header
        className={`${classes.stage} ${expanded ? classes.expanded : ''}`}
        onClick={() => setExpanded(true)}
      >
        <h4>{naming}</h4>
        <span>{`Важность - ${importance}%`}</span>
        <span
          className={classes.switch}
          onClick={event => {
            event.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? <>&#128897;</> : <>&#128899;</>}
        </span>
        <p style={{ color: `${color[status]}` }}>{status}</p>
      </header>
      {expanded && (
        <main className={classes.container}>
          <form>
            <label className={classes.inputContainer} htmlFor={naming + ' naming'}>
              Наименование
              <Input
                value={inputData.naming}
                key="Наименование"
                width="550px"
                required
                id={naming + ' naming'}
                name="naming"
                onChange={handleInputChange}
              />
            </label>
            <div className={classes.dateWrapper}>
              <label htmlFor={naming + ' factDataStart'}>Фактическая дата начала</label>
              <DatePicker
                initialCheckedDate={factDateStart}
                onChange={event => setFactDateStart(event)}
                key="Фактическая начала"
                name="Фактическая начала"
                id={naming + ' factDataStart'}
              />
              <label htmlFor={naming + ' planDataStart'}>Планируемая дата начала</label>
              <DatePicker
                initialCheckedDate={planDateStart}
                onChange={event => setPlanDateStart(event)}
                key="Планируемая начала"
                name="Планируемая начала"
                id={naming + ' planDataStart'}
              />
              <label htmlFor={naming + ' factDataEnd'}>Фактическая дата окончания</label>
              <DatePicker
                initialCheckedDate={factDateEnd}
                onChange={event => setFactDateEnd(event)}
                key="Фактическая окончания"
                name="Фактическая окончания"
                id={naming + ' factDataEnd'}
              />
              <label htmlFor={naming + ' planDataEnd'}>Планируемая дата окончания</label>
              <DatePicker
                initialCheckedDate={planDateEnd}
                onChange={event => setPlanDateEnd(event)}
                key="Планируемая окончания"
                name="Планируемая окончания"
                id={naming + ' planDataEnd'}
              />
            </div>
            <label className={classes.inputContainer} htmlFor={naming + ' duration'}>
              Длительность
              <Input
                value={inputData.duration}
                key="Длительность"
                width="550px"
                required
                id={naming + ' duration'}
                name="duration"
                onChange={handleInputChange}
              />
            </label>
            <label className={classes.inputContainer} htmlFor={naming + ' executor'}>
              Исполнитель мероприятия
              <Input
                value={inputData.executor}
                key="Исполнитель"
                width="550px"
                required
                id={naming + ' executor'}
                name="executor"
                onChange={handleInputChange}
              />
            </label>
            <label className={classes.inputContainer} htmlFor={naming + ' importance'}>
              Важность, %
              <Input
                value={inputData.importance}
                key="Важность"
                width="550px"
                required
                id={naming + ' importance'}
                name="importance"
                onChange={handleInputChange}
              />
            </label>
            <label className={classes.inputContainer} htmlFor={naming + ' status'}>
              Статус
              <Select
                name="status"
                hint=""
                id={naming + ' status'}
                isClearable
                initialCheckedValue={selectData}
                options={[
                  {
                    label: 'Запланировано',
                    value: 'Запланировано',
                  },
                  {
                    label: 'Просрочено',
                    value: 'Просрочено',
                  },
                  {
                    label: 'Завершено',
                    value: 'Завершено',
                  },
                ]}
                placeholder="Выберите вариант"
                width="550px"
                onChange={event => setSelectData(event)}
              />
            </label>
            <label className={classes.inputContainer}>
              Примечание
              <Input
                value={inputData.annotation}
                width="550px"
                required
                id={naming + ' status'}
                name="annotation"
                onChange={handleInputChange}
                placeholder="Введите текст примечания"
                onClear={() => {
                  handleClearInput('annotation');
                }}
                // invalid
                errorMessage="Поле обязательно для заполнения"
              />
            </label>
          </form>
          <footer className={classes.footer}>
            <Button
              label="Сохранить изменения"
              appearance="blue"
              onClick={() => {
                const formData = {
                  ...inputData,
                  planDateStart,
                  planDateEnd,
                  factDateStart,
                  factDateEnd,
                  selectData: selectData[0].value,
                };
                console.log(formData);
              }}
            />
            <p>
              <Icon img={DeleteIcon} fill="red" hoverColor="red" />
              <span>Удалить этап</span>
            </p>
          </footer>
        </main>
      )}
    </>
  );
};
