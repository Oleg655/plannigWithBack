import React from 'react';

import { Arrow } from 'components/table/Arrow';
import { Icon } from 'k6-ui/v2';
import { SortIcon } from 'k6-ui/v2/assets/icons';
import { observer } from 'mobx-react-lite';
import { rootStore } from 'store';
import { DropdownContainer, Item } from 'widgets/dropdown/Dropdown';

export const Sorts = observer(() => {
  const { tableStore } = rootStore;
  const sortTableData = (title: string, id: number) => {
    tableStore.setSortArrow(id);
    tableStore.setIsColumnSort(title);
    tableStore.setUserSort(title);
  };

  return (
    <DropdownContainer
      hidden="BACKDROP"
      renderContent={
        <p className="icon-controll-container ">
          <Icon img={SortIcon} fill="#000" />
          <span>Сортировка </span>
        </p>
      }
      width="250px"
      padding="15px"
      top="100%"
      left="-120%"
    >
      {tableStore.smartColumns.map((element: any) => {
        return (
          element.isShown && (
            <Item
              key={element.id}
              callback={() => {
                sortTableData(element.columnTitle, element.id);
              }}
              title={element.headerTitle}
            >
              <Arrow element={element} />
            </Item>
          )
        );
      })}
    </DropdownContainer>
  );
});
