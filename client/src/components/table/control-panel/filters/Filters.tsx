import React, { useState } from 'react';

import { Button, Icon, Input, Select } from 'k6-ui/v2';
import { ClearIcon, FilterIcon } from 'k6-ui/v2/assets/icons';
import { Modal } from 'widgets/modal/Modal';

import classes from './fiters.module.css';

export const Filters = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [inputData, setInputData] = useState({
    contextSearch: '',
    event: '',
    stage: '',
    author: '',
    importance: '',
  });

  const [selectData, setSelectData] = useState([{ label: '', value: '' }]);

  const handleInputChange = (event: any) => {
    const { id, value } = event.target;
    setInputData(prevInputData => ({ ...prevInputData, [id]: value }));
  };

  const handleClearInput = (inputName: string) => {
    setInputData(prevInputData => ({ ...prevInputData, [inputName]: '' }));
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)} className={classes.filter}>
        <p className="icon-controll-container ">
          <Icon img={FilterIcon} fill="#000" />
          <span>Фильтровать</span>
        </p>
      </div>
      <Modal backgroundStyle={classes.modal} isOpen={isOpen} handleClose={() => setIsOpen(false)}>
        <main className={classes.container}>
          <header className={classes.header}>
            <h3>Фильтровать</h3>
            <Icon
              onClick={() => setIsOpen(false)}
              img={ClearIcon}
              fill="#000"
              hoverColor="#0d62ff"
              width="10px"
            />
          </header>

          <form className={classes.form}>
            <label htmlFor="contextSearch">
              Контекстный поиск
              <Input
                value={inputData.contextSearch}
                width="550px"
                required
                id="contextSearch"
                name="contextSearch"
                onChange={handleInputChange}
                onClear={() => {
                  handleClearInput('contextSearch');
                }}
              />
            </label>

            <label htmlFor="event">
              Мероприятие
              <Input
                value={inputData.event}
                width="275px"
                required
                id="event"
                name="event"
                onChange={handleInputChange}
                onClear={() => {
                  handleClearInput('event');
                }}
              />
            </label>

            <label htmlFor="stage">
              Этап
              <Input
                value={inputData.stage}
                width="275px"
                required
                id="stage"
                name="stage"
                onChange={handleInputChange}
                onClear={() => {
                  handleClearInput('stage');
                }}
              />
            </label>

            <label htmlFor="author">
              Ф.И.О. автора
              <Input
                value={inputData.author}
                width="275px"
                required
                id="author"
                name="author"
                onChange={handleInputChange}
                onClear={() => {
                  handleClearInput('author');
                }}
              />
            </label>

            <label htmlFor="status">
              Статус
              <Select
                name="status"
                id="status"
                hint=""
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
                width="275px"
                onChange={event => setSelectData(event)}
              />
            </label>

            <label htmlFor="importance">
              Важность
              <Input
                value={inputData.importance}
                width="275px"
                required
                id="importance"
                name="importance"
                onChange={handleInputChange}
                onClear={() => {
                  handleClearInput('importance');
                }}
              />
            </label>
          </form>
          <footer className={classes.footer}>
            <Button
              label="Применить фильтр"
              appearance="blue"
              onClick={() => {
                const formData = {
                  ...inputData,
                  selectData: selectData[0].value,
                };
                console.log(formData);
                setIsOpen(false);
              }}
            />
            <Button
              onClick={() => {
                setInputData({
                  contextSearch: '',
                  event: '',
                  stage: '',
                  author: '',
                  importance: '',
                });
                setSelectData([{ label: '', value: '' }]);
              }}
              label="Сбросить значения"
            />
          </footer>
        </main>
      </Modal>
    </>
  );
};
