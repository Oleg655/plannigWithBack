import React from 'react';

import { observer } from 'mobx-react-lite';
import { rootStore } from 'store';

export const Pivot = observer(({ columnId }: { columnId: string }) => {
  const { tableStore } = rootStore;

  return (
    <div
      onMouseDown={() => {
        tableStore.activeColumn = columnId;
      }}
      className={`right-pivot ${tableStore.activeColumn === columnId ? 'active' : ''}`}
    />
  );
});
