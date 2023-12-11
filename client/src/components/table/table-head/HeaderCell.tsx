import React, { useRef } from 'react';

import { observer } from 'mobx-react-lite';

import classes from './table-head.module.css';

export const HeaderCell = observer(
  ({
    isShown,
    sortTableData,
    children,
  }: {
    isShown: string;
    sortTableData: () => void;
    children: JSX.Element[];
  }) => {
    const ref = useRef(null);

    return (
      <td style={{ display: isShown }} className={classes.menu} ref={ref} onClick={sortTableData}>
        {children}
      </td>
    );
  },
);
