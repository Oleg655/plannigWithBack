import { RefObject } from 'react';

import { ColumnI } from '../types';

export const resizer = (
  event: MouseEvent,
  tableElement: RefObject<HTMLTableElement>,
  createdColumns: ColumnI[],
  minCellWidth: number,
  activeIndex: string,
) => {
  const filteredCreatedColumns = createdColumns.filter(element => element.isShown === true);
  const fractions = filteredCreatedColumns.map((element: ColumnI) => {
    if (element.id === activeIndex) {
      const currentColumn = document.getElementById(element.id);
      const width = event.clientX - currentColumn.getBoundingClientRect().left;

      if (width >= minCellWidth) {
        return `${width}px`;
      }
    }
    return `${document.getElementById(element.id).getBoundingClientRect().width}px`;
  });
  tableElement.current.style.gridTemplateColumns = `${fractions.join(' ')}`;
};

export const gridResizer = (
  event: MouseEvent,
  tableElement: RefObject<HTMLTableElement>,
  createdColumns: ColumnI[],
  minCellWidth: number,
  activeIndex: string,
) => {
  const tableWidth = tableElement.current.getBoundingClientRect().width;
  const filteredCreatedColumns = createdColumns.filter(element => element.isShown === true);
  const defaultWidth = tableWidth / filteredCreatedColumns.length;

  const leftRestWidth = filteredCreatedColumns.find(element => {
    return element.id === activeIndex;
  });

  const currentColumn = document.getElementById(leftRestWidth.id).getBoundingClientRect().left;

  const nextIndex = filteredCreatedColumns.indexOf(leftRestWidth);

  const rightRestWidth =
    tableWidth -
    document.getElementById(filteredCreatedColumns[nextIndex + 1].id).getBoundingClientRect().right;

  const rightSide = tableWidth - event.clientX - rightRestWidth;
  const leftSide = tableWidth - rightSide - currentColumn - rightRestWidth;

  if (leftSide > defaultWidth * filteredCreatedColumns.length) {
    return;
  }
  if (leftSide < 50) {
    return;
  }
  if (rightSide < 50) {
    return;
  }

  const columns = filteredCreatedColumns.map((element, _, array) => {
    if (element.id === activeIndex) {
      return `${leftSide}px`;
    }
    if (element.id === array[nextIndex + 1].id) {
      return `${rightSide}px`;
    }
    return `${document.getElementById(element.id).getBoundingClientRect().width}px`;
  });

  tableElement.current.style.gridTemplateColumns = `${columns.join(' ')}`;
};
