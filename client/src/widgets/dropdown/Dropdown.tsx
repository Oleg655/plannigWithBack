/* eslint-disable react/function-component-definition */
import React, { useEffect, useRef, useState } from 'react';

import './dropdown.css';
import { Checkbox } from 'k6-ui/v2';
import { observer } from 'mobx-react-lite';

type Hidden = 'BACKDROP' | 'CURRENT';

export const DropdownContainer = ({
  children,
  renderContent,
  hidden,
  width,
  padding,
  top,
  left,
}: {
  children: JSX.Element | JSX.Element[];
  renderContent: JSX.Element | JSX.Element[];
  hidden: Hidden;
  width: string;
  padding: string;
  top: string;
  left: string;
}) => {
  const [isOpen, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div ref={hidden === 'BACKDROP' ? dropdownRef : null} className="dropdown-container">
      <span
        ref={hidden === 'CURRENT' ? dropdownRef : null}
        className="dropdown-btn"
        onClick={() => {
          setOpen(prev => !prev);
        }}
      >
        {renderContent}
      </span>
      {isOpen && (
        <ul style={{ width, padding, top, left }} className="dropdown-list">
          {children}
        </ul>
      )}
    </div>
  );
};

export const List = ({
  children,
  width,
  padding,
  top,
  left,
}: {
  children: JSX.Element | JSX.Element[];
  width: string;
  padding: string;
  top: string;
  left: string;
}) => {
  return (
    <ul style={{ width, padding, top, left }} className="dropdown-list">
      {children}
    </ul>
  );
};

export const Item = ({
  title,
  children,
  callback,
}: {
  title: string | number;
  children?: JSX.Element | JSX.Element[];
  callback?: () => void;
}) => {
  return (
    <>
      {!children && (
        <li
          className="dropdown-item"
          onClick={() => {
            callback();
          }}
        >
          {title}
        </li>
      )}
      {children && (
        <li
          className="dropdown-item"
          onClick={() => {
            callback();
          }}
        >
          {title}
          <span>{children}</span>
        </li>
      )}
    </>
  );
};

export const CheckboxItem = observer(
  ({
    checked,
    title,
    callback,
  }: {
    checked: boolean;
    title: string;
    callback?: (checkbox: boolean) => void;
  }) => {
    return (
      <label htmlFor={title}>
        <li className="dropdown-checkbox-item">
          <Checkbox
            id={title}
            onChange={event => {
              callback(event.target.checked);
            }}
            checked={checked}
            label={title}
          />
        </li>
      </label>
    );
  },
);
