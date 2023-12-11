import React, { ReactNode, useEffect } from 'react';

import classes from './modal.module.css';
import { Portal } from './Portal';

interface ModalI {
  children: ReactNode;
  isOpen: boolean;
  handleClose: () => void;
  backgroundStyle: string;
}

export const Modal = ({ children, isOpen, handleClose, backgroundStyle }: ModalI) => {
  useEffect(() => {
    const closeOnEscapeKey = (event: KeyboardEvent) =>
      event.key === 'Escape' ? handleClose() : null;
    document.body.addEventListener('keydown', closeOnEscapeKey);
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [handleClose]);

  if (!isOpen) return null;

  return (
    <Portal wrapperId="react-portal-modal-container">
      <div onClick={handleClose} className={classes.backdrop} />
      <div className={backgroundStyle}>{children}</div>
    </Portal>
  );
};
