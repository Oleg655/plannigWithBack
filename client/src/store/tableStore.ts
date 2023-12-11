import { makeAutoObservable } from 'mobx';
import { data } from 'store/test-data';
import { ResizeMode } from 'types';

import { RootStore } from './rootStore';

export class TableStore {
  rootStore: RootStore;

  data: any = data;

  events: any;

  _isShownSidebar: boolean = false;

  _resizerMode: ResizeMode = ResizeMode.NEXTCOLUMN;

  _smartColumns: any[] = [];

  _currentSmartColumn: any = null;

  _activeColumn: string | null = null;

  _currentPage: number = 1;

  _contentPerPage: number = 3;

  isColumnSort: {
    title: any;
    progress: any;
    amount: any;
    status: any;
    name: any;
  } = {
    title: false,
    progress: false,
    amount: false,
    status: false,
    name: false,
  };

  sortArrow: null | number = null;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  set isShownSidebar(isShown: boolean) {
    this._isShownSidebar = isShown;
  }

  get isShownSidebar() {
    return this._isShownSidebar;
  }

  set resizerMode(mode: ResizeMode) {
    this._resizerMode = mode;
  }

  get resizerMode() {
    return this._resizerMode;
  }

  set currentSmartColumn(header: any) {
    this._currentSmartColumn = header;
  }

  get currentSmartColumn() {
    return this._currentSmartColumn;
  }

  set smartColumns(headers: any[]) {
    this._smartColumns = headers;
  }

  get smartColumns() {
    return this._smartColumns;
  }

  get pageCount() {
    return this.data.length / this.contentPerPage;
  }

  generateSmartColumns() {
    const cellNames = [
      { headerTitle: 'Название мероприятия', columnTitle: 'title' },
      { headerTitle: 'Статус', columnTitle: 'progress' },
      { headerTitle: 'Планируемая дата начала', columnTitle: 'amount' },
      { headerTitle: 'Фактическая дата начала', columnTitle: 'status' },
      { headerTitle: 'Планируемая дата окончания', columnTitle: 'name' },
    ];
    this.smartColumns = cellNames.map(({ headerTitle, columnTitle }, index) => ({
      id: `${headerTitle} ${columnTitle}`,
      order: index,
      headerTitle,
      columnTitle,
      isShown: true,
    }));
  }

  get contentPerPage() {
    return this._contentPerPage;
  }

  set contentPerPage(count: number) {
    this._contentPerPage = count;
  }

  get currentPage() {
    return this._currentPage;
  }

  set currentPage(page: number) {
    this._currentPage = page;
  }

  get elementsOnPage() {
    const indexOfLastItem = this._currentPage * this._contentPerPage;
    const indexOfFirstItem = indexOfLastItem - this._contentPerPage;
    const slicedData = this.data.slice(indexOfFirstItem, indexOfLastItem);
    return slicedData;
  }

  set activeColumn(columnId: string) {
    this._activeColumn = columnId;
  }

  get activeColumn() {
    return this._activeColumn;
  }

  setIsColumnSort(title: string) {
    this.isColumnSort = {
      ...this.isColumnSort,
      [title]: !this.isColumnSort[title as keyof typeof this.isColumnSort],
    };
  }

  setUserSort(title: string) {
    this.data.sort((elementA: any, elementB: any) => {
      if (elementA[title] > elementB[title]) {
        return this.isColumnSort[title as keyof typeof this.isColumnSort] ? -1 : 1;
      }
      if (elementA[title] < elementB[title]) {
        return this.isColumnSort[title as keyof typeof this.isColumnSort] ? 1 : -1;
      }
      return 0;
    });
  }

  isShownColumn(id: number, isShown: boolean) {
    this.smartColumns = this.smartColumns.map(element => {
      if (element.id === id) {
        element.isShown = isShown;
      }
      return element;
    });
  }

  setSortArrow(columnId: number) {
    this.sortArrow = columnId;
  }

  dragStart(column: any) {
    this.currentSmartColumn = column;
  }

  dragAndDrop(column: any) {
    const newArray = this.smartColumns.map((element: any) => {
      if (element.id === column.id) {
        return { ...element, order: this.currentSmartColumn.order };
      }
      if (element.id === this.currentSmartColumn.id) {
        return { ...element, order: column.order };
      }
      return element;
    });

    this.smartColumns = newArray.sort((a: any, b: any) => {
      if (a.order > b.order) {
        return 1;
      }
      return -1;
    });
  }
}
