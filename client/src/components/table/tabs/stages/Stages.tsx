import React from 'react';

import { Button } from 'k6-ui/v2';

import { Form } from './form/Form';
import classes from './stages.module.css';

export const Stages = () => {
  return (
    <>
      <header className={classes.header}>
        <p>Сумма важностей этапов - 100%</p>
        <Button
          appearance="blue"
          label="Добавить этап"
          onClick={function noRefCheck() {}}
          width="100px"
        />
      </header>
      <Form status="Завершено" importance={50} naming="Проверка комиссией по принятию" />
      <Form status="Запланировано" importance={20} naming="Тестирование на фокус-группе" />
    </>
  );
};
