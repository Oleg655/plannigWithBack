import React, { RefObject } from 'react';

import './control-panel.css';
import { observer } from 'mobx-react-lite';

import { Filters } from './filters/Filters';
import { ResizerMode } from './resizer-mode/ReizerMode';
import { ShownList } from './shown-list/ShownList';
import { Sorts } from './sorts/Sorts';

export const ControlPanel = observer(
  ({ tableElement }: { tableElement: RefObject<HTMLTableElement> }) => {
    return (
      <div className="control-panel-wrapper">
        <div className="control-panel">
          <Filters />
          <ShownList />
          <Sorts />
          <ResizerMode tableElement={tableElement} />
        </div>
      </div>
    );
  },
);
