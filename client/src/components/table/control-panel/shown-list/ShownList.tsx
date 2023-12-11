import React from 'react';

import { Checkbox, Icon } from 'k6-ui/v2';
import { SettingsIcon } from 'k6-ui/v2/assets/icons';
import { observer } from 'mobx-react-lite';
import { rootStore } from 'store';
import { CheckboxItem, DropdownContainer, List } from 'widgets/dropdown/Dropdown';

import classes from './shown-list.module.css';

export const ShownList = observer(() => {
  const { tableStore } = rootStore;

  return (
    <DropdownContainer
      hidden="BACKDROP"
      renderContent={
        <p className="icon-controll-container ">
          <Icon img={SettingsIcon} fill="#000" />
          <span>Параметры списка</span>
        </p>
      }
      width="300px"
      padding="15px"
      top="100%"
      left="-85%"
    >
      {tableStore.smartColumns.map((element: any) => {
        return (
          // <CheckboxItem
          //   checked={element.isShown}
          //   callback={checkbox => tableStore.isShownColumn(element.id, checkbox)}
          //   title={element.headerTitle}
          //   key={element.id}
          // />
          <label key={element.id} htmlFor={element.headerTitle}>
            <li className={classes.checkbox}>
              <Checkbox
                id={element.headerTitle}
                onChange={event => {
                  tableStore.isShownColumn(element.id, event.target.checked);
                }}
                checked={element.isShown}
                label={element.headerTitle}
              />
            </li>
          </label>
        );
      })}
    </DropdownContainer>
  );
});
