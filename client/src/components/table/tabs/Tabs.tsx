import React, { RefObject, useState } from 'react';

import { Icon } from 'k6-ui/v2';
import { ClearIcon } from 'k6-ui/v2/assets/icons';
import { observer } from 'mobx-react-lite';
import { rootStore } from 'store';
import { generateColumnsSize } from 'utils';

import { Parameters } from './parameters/Parameters';
import { Stages } from './stages/Stages';
import classes from './tabs.module.css';

export const Tabs = observer(({ tableElement }: { tableElement: RefObject<HTMLTableElement> }) => {
  const { tableStore } = rootStore;
  const [activeTab, setActiveTab] = useState(1);

  const tabsData = [
    { id: 1, title: 'Этапы', content: <Stages /> },
    { id: 2, title: 'Параметры', content: <Parameters /> },
  ];

  return (
    <>
      <header className={classes.header}>
        {tabsData.map(element => (
          <p
            key={element.id}
            onClick={() => setActiveTab(element.id)}
            className={element.id === activeTab ? classes.active : ''}
          >
            {element.title}
          </p>
        ))}
        <span
          className={classes.close}
          onClick={() => {
            tableElement.current.style.gridTemplateColumns = generateColumnsSize(
              tableStore.smartColumns,
            );
            tableStore.isShownSidebar = false;
          }}
        >
          <Icon img={ClearIcon} fill="#000" hoverColor="#0d62ff" width="10px" />
        </span>
      </header>
      {tabsData.map(
        element =>
          element.id === activeTab && (
            <div key={element.id} className={classes.container}>
              {element.content}
            </div>
          ),
      )}
    </>
  );
});
