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
  id?: string;
  order: number;
  headerTitle: string;
  columnTitle: string;
  isShown: boolean;
}
export interface TablePropsI {
  headers: Headers[];
  minCellWidth: number;
  children: JSX.Element | JSX.Element[];
}
