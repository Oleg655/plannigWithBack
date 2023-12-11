import React, { useCallback, useEffect, useRef } from 'react';

import { observer } from 'mobx-react-lite';
import { rootStore } from 'store';

import { gridResizer, resizer } from '../../utils/resizer';

import { ControlPanel } from './control-panel/ControlPanel';
import { ResizeMode } from '../../types';
import { TableBody } from './table-body/TableBody';
import { TableHead } from './table-head/TableHead';
import classes from './table.module.css';
import { Tabs } from './tabs/Tabs';
import { generateColumnsSize } from 'utils';

export const Table = observer(() => {
  const { tableStore } = rootStore;
  const tableElement = useRef<HTMLTableElement>(null);

  const mouseMove = useCallback(
    (event: MouseEvent) => {
      if (tableStore.resizerMode === ResizeMode.NEXTCOLUMN) {
        gridResizer(event, tableElement, tableStore.smartColumns, 50, tableStore.activeColumn);
      }
      if (tableStore.resizerMode === ResizeMode.SCROLL) {
        resizer(event, tableElement, tableStore.smartColumns, 50, tableStore.activeColumn);
      }
    },
    [tableStore.activeColumn, tableStore.smartColumns, tableStore.resizerMode],
  );

  const mouseUp = useCallback(() => {
    tableStore.activeColumn = null;
  }, [tableStore]);

  useEffect(() => {
    if (tableStore.activeColumn !== null) {
      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('mouseup', mouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, [tableStore.activeColumn, mouseMove, mouseUp]);

  return (
    <main className={tableStore.isShownSidebar ? classes.container : ''}>
      <section style={{ width: tableStore.isShownSidebar && 'calc(100% - 770px)' }}>
        <ControlPanel tableElement={tableElement} />
        <table
          ref={tableElement}
          style={{
            gridTemplateColumns: generateColumnsSize(tableStore.smartColumns),
          }}
        >
          <TableHead />
          <TableBody tableElement={tableElement} />
        </table>
      </section>
      {tableStore.isShownSidebar && (
        <aside className={classes.sidebar}>
          <Tabs tableElement={tableElement} />
        </aside>
      )}
    </main>
  );
});
