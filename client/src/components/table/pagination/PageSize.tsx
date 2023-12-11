import React from 'react';

import { Icon } from 'k6-ui/v2';
import { SettingsIcon } from 'k6-ui/v2/assets/icons';
import { observer } from 'mobx-react-lite';
import { rootStore } from 'store';
import { DropdownContainer, Item, List } from 'widgets/dropdown/Dropdown';

export const PageSize = observer(() => {
  const { tableStore } = rootStore;

  return (
    <div className="page-size">
      <span>Элементов: {tableStore.contentPerPage}</span>
      <DropdownContainer
        hidden="CURRENT"
        renderContent={<Icon img={SettingsIcon} fill="#000" width="40px" />}
        width="50px"
        padding="5px"
        top="-580%"
        left="100%"
      >
        <Item
          callback={() => {
            tableStore.contentPerPage = 3;
          }}
          title={3}
        />
        <Item
          callback={() => {
            tableStore.contentPerPage = 4;
          }}
          title={4}
        />
        <Item
          callback={() => {
            tableStore.contentPerPage = 6;
          }}
          title={6}
        />
      </DropdownContainer>
    </div>
  );
});
