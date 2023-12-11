import React from 'react';

import { observer } from 'mobx-react-lite';
import { rootStore } from 'store';

export const Arrow = observer(({ element }: { element: any }) => {
  const { tableStore } = rootStore;

  return (
    <div style={{ display: !(tableStore.sortArrow === element.id) && 'none' }}>
      {tableStore.isColumnSort[element.columnTitle as keyof typeof tableStore.isColumnSort] ? (
        <span>&#8593;</span>
      ) : (
        <span>&#8595;</span>
      )}
    </div>
  );
});
