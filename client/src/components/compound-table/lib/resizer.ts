import { RefObject } from 'react';

import { ColumnI } from './types';

export const resizer = (
  event: MouseEvent,
  tableElement: RefObject<HTMLTableElement>,
  createdColumns: ColumnI[],
  minCellWidth: number,
  activeIndex: number,
) => {
  const filteredCreatedColumns = createdColumns.filter(element => element.isShown === true);
  const fractions = filteredCreatedColumns.map((column: ColumnI) => {
    if (column.id === activeIndex) {
      const width = event.clientX + tableElement.current.scrollLeft - column.ref.current.offsetLeft;
      if (width >= minCellWidth) {
        return `${width}px`;
      }
    }
    return `${column.ref.current.offsetWidth}px`;
  });
  tableElement.current.style.gridTemplateColumns = `${fractions.join(' ')}`;
};

export const gridResizer = (
  event: MouseEvent,
  tableElement: RefObject<HTMLTableElement>,
  createdColumns: ColumnI[],
  minCellWidth: number,
  activeIndex: number,
) => {
  // console.log(tableElement.current.scrollWidth);
  // console.log(tableElement.current.offsetWidth);
  // console.log(tableElement.current.clientWidth);
  // if (tableElement.current.scrollWidth > tableElement.current.offsetWidth) {
  //   tableElement.current.style.overflow = 'auto';
  //   tableElement.current.style.overflowY = 'hidden';
  // } else {
  //   // tableElement.current.style.overflow = 'auto';
  //   tableElement.current.style.overflowX = 'hidden';
  //   tableElement.current.style.overflowY = 'hidden';
  // }

  const filteredCreatedColumns = createdColumns.filter(element => element.isShown === true);
  const defaultWidth = tableElement.current.offsetWidth / filteredCreatedColumns.length;

  // const leftRestWidth = filteredCreatedColumns.find(element => element.id === activeIndex).ref
  //   .current.offsetLeft;

  const leftRestWidth = filteredCreatedColumns
    .find(element => element.id === activeIndex)
    .ref.current.getBoundingClientRect().left;

  const currentElement = filteredCreatedColumns.find(element => {
    return element.id === activeIndex;
  });
  const nextINdex = filteredCreatedColumns.indexOf(currentElement);
  const rightRestWidth =
    tableElement.current.offsetWidth -
    filteredCreatedColumns[nextINdex + 1].ref.current.getBoundingClientRect().right;

  const rightSide = tableElement.current.offsetWidth - event.clientX - rightRestWidth;
  const leftSide = tableElement.current.offsetWidth - rightSide - leftRestWidth - rightRestWidth;

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
    if (element.id === array[nextINdex + 1].id) {
      return `${rightSide}px`;
    }
    return `${element.ref.current.offsetWidth}px`;
  });

  tableElement.current.style.gridTemplateColumns = `${columns.join(' ')}`;
};
