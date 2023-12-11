import React, { useCallback } from 'react';

import { observer } from 'mobx-react-lite';
import { rootStore } from 'store';

import { Arrow } from '../Arrow';

import classes from './table-head.module.css';

export const TableHead = observer(() => {
  const { tableStore } = rootStore;

  const sortTableData = (title: string, columnId: number) => {
    tableStore.setIsColumnSort(title);
    tableStore.setUserSort(title);
    tableStore.setSortArrow(columnId);
  };

  const dragStartHandler = (event: any, column: any): void => {
    tableStore.dragStart(column);
  };
  const dragEndHandler = useCallback(() => {}, []);
  const dragOverHandler = useCallback((event: any): void => {
    event.preventDefault();
    event.target.style.background = 'red';
  }, []);
  const dragLeaveHandler = useCallback((event: any): void => {
    event.target.style.background = 'white';
  }, []);
  const dropHandler = (event: any, column: any): void => {
    event.target.style.background = 'white';
    event.preventDefault();
    tableStore.dragAndDrop(column);
  };

  return (
    <thead>
      <tr>
        {tableStore.smartColumns.map((element: any) => {
          return (
            <td
              id={element.id}
              style={{ display: !element.isShown && 'none' }}
              key={element.id}
              onClick={() => {
                sortTableData(element.columnTitle, element.id);
              }}
            >
              <span
                className={classes.title}
                draggable
                onDragStart={event => dragStartHandler(event, element)}
                onDragEnd={() => dragEndHandler()}
                onDragOver={event => dragOverHandler(event)}
                onDragLeave={event => dragLeaveHandler(event)}
                onDrop={event => dropHandler(event, element)}
              >
                {element.headerTitle}
              </span>
              <span style={{ display: !(tableStore.sortArrow === element.id) && 'none' }}>
                <Arrow element={element} />
              </span>
              <div
                onMouseDown={() => {
                  tableStore.activeColumn = element.id;
                }}
                className={classes.pivot}
              />
            </td>
          );
        })}
      </tr>
    </thead>
  );
});
