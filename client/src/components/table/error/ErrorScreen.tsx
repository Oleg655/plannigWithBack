import React, { useState } from 'react';

import { rootStore } from 'store';
import { formatDate, formatTime } from 'utils';
import { Modal } from 'widgets/modal';

import classes from './error.module.css';

export const ErrorScreen = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { errorStore } = rootStore;

  return (
    <Modal backgroundStyle={classes.modal} isOpen={isOpen} handleClose={() => setIsOpen(false)}>
      <main className={classes.container}>
        <h1 className={classes.title}>{errorStore.errorBody.title}</h1>
        <p>{errorStore.errorBody.message}</p>
        <p>
          При необходимости, обратитесь в Службу поддержки пользователей по электронной почте{' '}
          <a href="mailto:spp@kodeks.ru">spp@kodeks.ru</a> или по телефону 8-800-505-78-25
        </p>
        <footer className={classes.footer}>
          <p>
            Дата: <span>{formatDate()}</span>
          </p>
          <p>Время: {formatTime()}</p>
          <p>
            Код ошибки: <span>{errorStore.errorBody.statusCode}</span>
          </p>
        </footer>
      </main>
    </Modal>
  );
};
