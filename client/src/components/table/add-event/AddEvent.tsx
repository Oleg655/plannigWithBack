import React from 'react';

import { Button } from 'k6-ui/v2';

import classes from './add-event.module.css';

export const AddEvent = () => {
  return (
    <div className={classes.container}>
      <h2>Программа мероприятий по стандартизации</h2>
      <Button
        appearance="blue"
        label="Добавить мероприятие"
        onClick={function noRefCheck() {}}
        width="100px"
      />
    </div>
  );
};
