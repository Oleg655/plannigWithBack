import React, { RefObject } from 'react';

import { observer } from 'mobx-react-lite';
import { rootStore } from 'store';
import { generateColumnsSize } from 'utils';
import { ProgressBar } from 'widgets/progress-bar/PreogressBar';

import { TableData } from '../table-data/TableData';

export const TableBody = observer(
  ({ tableElement }: { tableElement: RefObject<HTMLTableElement> }) => {
    const { tableStore } = rootStore;

    return (
      <tbody>
        {tableStore.elementsOnPage.map((element: any) => {
          return (
            <tr
              onClick={() => {
                tableStore.isShownSidebar = true;
                tableElement.current.style.gridTemplateColumns = generateColumnsSize(
                  tableStore.smartColumns,
                );
              }}
              key={element.id}
            >
              {Object.keys(element).map((_, index) => {
                if (index > tableStore.smartColumns.length - 1) return;
                if (tableStore.smartColumns[index]?.columnTitle === 'title') {
                  return (
                    <TableData
                      renderTableDataContent={() => <button>Удалить</button>}
                      key={tableStore.smartColumns[index].id}
                      isShown={tableStore.smartColumns[index].isShown}
                      title={element[tableStore.smartColumns[index].columnTitle]}
                    />
                  );
                }
                if (tableStore.smartColumns[index]?.columnTitle === 'progress') {
                  return (
                    <TableData
                      renderTableDataContent={() => (
                        <ProgressBar
                          progress={element[tableStore.smartColumns[index]?.columnTitle]}
                        />
                      )}
                      key={tableStore.smartColumns[index].id}
                      isShown={tableStore.smartColumns[index].isShown}
                    />
                  );
                }
                return (
                  <TableData
                    key={tableStore.smartColumns[index]?.id}
                    isShown={tableStore.smartColumns[index]?.isShown}
                    title={element[tableStore.smartColumns[index]?.columnTitle]}
                  />
                );
              })}
            </tr>
          );
        })}
      </tbody>
    );
  },
);
