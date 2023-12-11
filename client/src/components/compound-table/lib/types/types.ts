import { RefObject } from 'react';

type PivotSideT = 'LEFT' | 'RIGHT';

interface Headers {
  headerTitle: string;
  columnTitle: string;
}

export interface PivotPropsI {
  side: PivotSideT;
  location: number;
}
export interface ColumnI {
  id?: number;
  order: number;
  headerTitle: string;
  columnTitle: string;
  ref: RefObject<HTMLTableCellElement>;
  isShown: boolean;
}
export interface TablePropsI {
  headers: Headers[];
  minCellWidth: number;
  children: JSX.Element | JSX.Element[];
}
