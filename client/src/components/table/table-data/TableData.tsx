import React, { memo } from 'react';

import { EditableSpan } from 'widgets/editable-span/EditableSpan';

export const TableData = memo(
  ({
    isShown,
    title,
    renderTableDataContent,
  }: {
    isShown: boolean;
    title?: string | number;
    renderTableDataContent?: () => JSX.Element | JSX.Element[];
  }) => {
    return (
      <td style={{ display: !isShown && 'none' }}>
        {title && <EditableSpan title={title} />}{' '}
        {renderTableDataContent && renderTableDataContent()}
      </td>
    );
  },
);
