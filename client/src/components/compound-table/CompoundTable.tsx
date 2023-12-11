/* eslint-disable react/function-component-definition */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import './compound-table.css';
import { SuntdHeader } from 'k6-ui/v2';
import { EditableSpan } from 'widgets/editable-span/EditableSpan';
import { ProgressBar } from 'widgets/progress-bar/PreogressBar';

import { data } from '../../store/test-data';

import { generateColumnsSize } from './lib';
import { createSmartHeaders } from './lib/createSmartHeaders';
import { gridResizer, resizer } from './lib/resizer';
import { ColumnI, PivotPropsI, ResizeMode, TablePropsI } from './lib/types';

export const TableContext = createContext(null);
export const TableActionsContext = createContext(null);

const TableProvider = ({ children, minCellWidth, headers }: TablePropsI) => {
  const [resizerMode, setResizerMode] = useState<ResizeMode>(ResizeMode.NEXTCOLUMN);

  const smartHeaders = createSmartHeaders(headers);
  const [smartColumn, setSmartColumn] = useState(smartHeaders);
  const [currentSmartColumn, setCurrentSmartColumn] = useState(null);

  const [pivotHeight, setPivotHeight] = useState<number>();
  const [showPivot, setShowPivot] = useState('pivot-highlighter');
  const [activeIndex, setActiveIndex] = useState(null);
  const tableElement = useRef<HTMLTableElement>(null);

  const [users, setUsers] = useState<any[]>(data);
  const [sorts, setSorts] = useState<any>({
    title: false,
    progress: false,
    amount: false,
    status: false,
    name: false,
  });
  const [sortArrow, setSortArrow] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [contentPerPage, setContentPerPage] = useState(3);

  const isShownColumn = useCallback(
    (id: number, isShown: boolean) => {
      setSmartColumn(
        smartColumn.map(element => {
          if (element.id === id) {
            element.isShown = isShown;
          }
          return element;
        }),
      );
    },
    [smartColumn],
  );

  const sortColumns = useCallback((a: ColumnI, b: ColumnI) => {
    if (a.order > b.order) {
      return 1;
    }
    return -1;
  }, []);

  const mouseMove = useCallback(
    (event: MouseEvent) => {
      if (resizerMode === ResizeMode.NEXTCOLUMN) {
        gridResizer(event, tableElement, smartColumn, minCellWidth, activeIndex);
      }
      if (resizerMode === ResizeMode.SCROLL) {
        resizer(event, tableElement, smartColumn, minCellWidth, activeIndex);
      }
    },
    [activeIndex, smartColumn, minCellWidth],
  );

  const removeListeners = useCallback(() => {
    window.removeEventListener('mousemove', mouseMove);
    window.removeEventListener('mouseup', removeListeners);
  }, [mouseMove]);

  const mouseUp = useCallback(() => {
    setShowPivot('pivot-highlighter');
    setActiveIndex(null);
    setPivotHeight(tableElement.current.clientHeight / smartColumn.length);
    removeListeners();
  }, [removeListeners, smartColumn.length]);

  useEffect(() => {
    if (activeIndex !== null) {
      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('mouseup', mouseUp);
    }

    return () => {
      removeListeners();
    };
  }, [minCellWidth, mouseMove, mouseUp, removeListeners, activeIndex]);

  const dragStartHandler = useCallback((event: any, element: ColumnI): void => {
    setCurrentSmartColumn(element);
  }, []);
  const dragEndHandler = useCallback(() => {}, []);
  const dragOverHandler = useCallback((event: any): void => {
    event.preventDefault();
    event.target.style.background = 'red';
  }, []);
  const dragLeaveHandler = useCallback((event: any): void => {
    event.target.style.background = 'white';
  }, []);
  const dropHandler = useCallback(
    (event: any, column: ColumnI): void => {
      event.target.style.background = 'white';
      event.preventDefault();
      setSmartColumn(
        smartColumn.map(element => {
          if (element.id === column.id) {
            return { ...element, order: currentSmartColumn.order };
          }
          if (element.id === currentSmartColumn.id) {
            return { ...element, order: column.order };
          }
          return element;
        }),
      );
    },
    [smartColumn, currentSmartColumn],
  );

  const sortTableData = useCallback(
    (columnTitle: string) => {
      setSorts({ ...sorts, [columnTitle]: !sorts[columnTitle] });
      setUsers(
        users.sort((elementA: any, elementB: any) => {
          if (elementA[columnTitle] > elementB[columnTitle]) {
            return sorts[columnTitle] ? -1 : 1;
          }
          if (elementA[columnTitle] < elementB[columnTitle]) {
            return sorts[columnTitle] ? 1 : -1;
          }
          return 0;
        }),
      );
    },
    [users, sorts],
  );

  const state = useMemo(() => {
    return {
      totalElements: users.length,
      currentPage,
      contentPerPage,
      sorts,
      sortArrow,
      smartColumn,
      currentSmartColumn,
      activeIndex,
      tableElement,
      pivotHeight,
      showPivot,
      users,
    };
  }, [
    currentPage,
    contentPerPage,
    pivotHeight,
    showPivot,
    activeIndex,
    smartColumn,
    sorts,
    sortArrow,
    currentSmartColumn,
    users,
  ]);

  const actions = useMemo(() => {
    return {
      setCurrentPage,
      setContentPerPage,
      dragStartHandler,
      dragEndHandler,
      dragOverHandler,
      dragLeaveHandler,
      dropHandler,
      sortTableData,
      sortColumns,
      setSortArrow,
      isShownColumn,
      setActiveIndex,
      setPivotHeight,
      setShowPivot,
      setResizerMode,
    };
  }, [
    setCurrentPage,
    setContentPerPage,
    dragStartHandler,
    dragEndHandler,
    dragOverHandler,
    dragLeaveHandler,
    dropHandler,
    sortTableData,
    sortColumns,
    isShownColumn,
    setActiveIndex,
    setPivotHeight,
    setShowPivot,
  ]);

  return (
    <TableActionsContext.Provider value={actions}>
      <TableContext.Provider value={state}>{children}</TableContext.Provider>
    </TableActionsContext.Provider>
  );
};

TableProvider.Table = function Table({ children }: { children: JSX.Element | JSX.Element[] }) {
  const { tableElement, smartColumn } = useContext(TableContext);
  return (
    <table
      ref={tableElement}
      style={{
        gridTemplateColumns: generateColumnsSize(smartColumn),
      }}
    >
      {children}
    </table>
  );
};

const Pivot = ({ side, location }: PivotPropsI) => {
  const { tableElement, pivotHeight, activeIndex } = useContext(TableContext);
  const { setPivotHeight, setShowPivot, setActiveIndex } = useContext(TableActionsContext);

  return (
    <>
      {side === 'LEFT' && (
        <div
          // style={{ height: pivotHeight }}
          className={`left-pivot ${activeIndex === location ? 'active' : ''}`}
        />
      )}
      {side === 'RIGHT' && (
        <div
          // style={{ height: pivotHeight }}
          onMouseDown={() => {
            setActiveIndex(location);
            // setPivotHeight(tableElement.current.clientHeight);
            // setShowPivot('');
          }}
          className={`right-pivot ${activeIndex === location ? 'active' : ''}`}
        />
      )}
    </>
  );
};

export const Arrow = ({ isSorted }: { isSorted: boolean }) => {
  return <div>{isSorted ? <span>&#8593;</span> : <span>&#8595;</span>}</div>;
};

TableProvider.TableHead = function TableHead() {
  const { showPivot, smartColumn, sorts, sortArrow } = useContext(TableContext);
  const { setSortArrow } = useContext(TableActionsContext);

  const {
    sortColumns,
    sortTableData,
    dragStartHandler,
    dragEndHandler,
    dragOverHandler,
    dragLeaveHandler,
    dropHandler,
  } = useContext(TableActionsContext);

  return (
    <thead>
      <tr>
        {smartColumn.sort(sortColumns).map((element: ColumnI) => {
          return (
            <td
              style={{ display: !element.isShown && 'none' }}
              // className={`menu-container ${showPivot}`}
              className="menu-container"
              ref={element.ref}
              key={element.id}
              onClick={() => {
                setSortArrow(element.id);
                sortTableData(element.columnTitle);
              }}
            >
              <span
                className="header-title"
                draggable
                onDragStart={event => dragStartHandler(event, element)}
                onDragEnd={event => dragEndHandler(event)}
                onDragOver={event => dragOverHandler(event)}
                onDragLeave={event => dragLeaveHandler(event)}
                onDrop={event => dropHandler(event, element)}
              >
                {element.headerTitle}
              </span>
              <span style={{ display: !(sortArrow === element.id) && 'none' }}>
                {/* {sorts[element.columnTitle] ? '↓' : '↑'}{' '} */}
                <Arrow isSorted={sorts[element.columnTitle]} />
              </span>
              {/* <Pivot side="LEFT" location={element.id} /> */}
              <Pivot side="RIGHT" location={element.id} />
            </td>
          );
        })}
      </tr>
    </thead>
  );
};

TableProvider.TableBody = function TableData({
  setShowSidebar,
}: {
  setShowSidebar: (flag: boolean) => void;
}) {
  const { tableElement, users, currentPage, contentPerPage, smartColumn } =
    useContext(TableContext);

  const indexOfLastItem = currentPage * contentPerPage;
  const indexOfFirstItem = indexOfLastItem - contentPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  const renderTableCells = (user: any) => {
    const cells: JSX.Element[] = [];
    let index = 0;
    for (const key in user) {
      if (key === 'id') {
        // eslint-disable-next-line no-continue
        continue;
      }
      if (smartColumn[index].id === 0) {
        cells.push(
          <TableProvider.TableData
            renderTableDataContent={() => <button>Удалить</button>}
            key={smartColumn[index].id}
            isShown={smartColumn[index].isShown}
            title={user.title}
          />,
        );
        index += 1;
      } else if (smartColumn[index].id === 1) {
        cells.push(
          <TableProvider.TableData
            renderTableDataContent={() => <ProgressBar progress={user.progress} />}
            key={smartColumn[index].id}
            isShown={smartColumn[index].isShown}
          />,
        );
        index += 1;
      } else {
        cells.push(
          <TableProvider.TableData
            key={smartColumn[index].id}
            isShown={smartColumn[index].isShown}
            title={user[smartColumn[index].columnTitle]}
          />,
        );
        index += 1;
      }
    }
    return cells;
  };
  return (
    <tbody>
      {currentItems.map((user: any) => {
        return (
          <TableProvider.TableRow
            callback={() => {
              tableElement.current.style.gridTemplateColumns = generateColumnsSize(smartColumn);
              setShowSidebar(true);
            }}
            key={user.id}
          >
            {renderTableCells(user)}
          </TableProvider.TableRow>
        );
      })}
    </tbody>
  );
};

TableProvider.TableRow = function TableRow({
  children,
  callback,
}: {
  children: JSX.Element[] | JSX.Element;
  callback: () => void;
}) {
  return <tr onClick={callback}>{children}</tr>;
};

TableProvider.TableData = function TableData({
  isShown,
  title,

  renderTableDataContent,
}: {
  isShown: boolean;
  title?: string | number;
  renderTableDataContent?: () => JSX.Element | JSX.Element[];
}) {
  return (
    <td style={{ display: !isShown && 'none' }}>
      {title && <EditableSpan title={title} />} {renderTableDataContent && renderTableDataContent()}
    </td>
  );
};

export const CompoundTableRender = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const headers = [
    { headerTitle: 'Название мероприятия', columnTitle: 'title' },
    { headerTitle: 'Статус', columnTitle: 'progress' },
    { headerTitle: 'Планируемая дата начала', columnTitle: 'amount' },
    { headerTitle: 'Фактическая дата начала', columnTitle: 'status' },
    { headerTitle: 'Планируемая дата окончания', columnTitle: 'name' },
  ];
  return (
    <>
      <SuntdHeader
        additionalInfo="additional info"
        controls
        // eslint-disable-next-line react/jsx-no-bind
        // fetchSystemName={function noRefCheck() {}}
        hintIconTitle="Справка"
        homeIcon
        // linksForDropdown={[
        //   {
        //     path: '/',
        //     title: 'Подсистема замечаний',
        //   },
        //   {
        //     path: '/',
        //     title: 'Контроль оборота НД',
        //   },
        //   {
        //     path: '/',
        //     title: 'Конструктор НД',
        //   },
        // ]}
        sourceLink="#"
        sourceLinks={[
          {
            path: '/',
            title: 'homepage',
          },
          {
            path: '/dropdowns',
            title: 'dropdowns',
          },
          {
            path: '/tooltips',
            title: 'tooltips',
          },
        ]}
        sourceTitle="source title"
        systemName="kApp-Header-theme-standard"
        title="Планирование разработки НД"
        userName="User 1"
        version="version"
      />
      <TableProvider minCellWidth={50} headers={headers}>
        <main className={showSidebar ? 'shown-sidebar-container' : ''}>
          <div style={{ width: showSidebar && 'calc(100% - 770px)' }}>
            <TableProvider.Table>
              <TableProvider.TableHead />
              <TableProvider.TableBody setShowSidebar={setShowSidebar} />
            </TableProvider.Table>
          </div>
        </main>
      </TableProvider>
    </>
  );
};
