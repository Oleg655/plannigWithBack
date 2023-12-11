import React, { RefObject } from 'react';

import { Icon } from 'k6-ui/v2';
import { SettingsIcon } from 'k6-ui/v2/assets/icons';
import { rootStore } from 'store';
import { ResizeMode } from 'types';
import { generateColumnsSize } from 'utils';
import { DropdownContainer, Item } from 'widgets/dropdown/Dropdown';

export const ResizerMode = ({ tableElement }: { tableElement: RefObject<HTMLTableElement> }) => {
  const { tableStore } = rootStore;

  return (
    <DropdownContainer
      hidden="CURRENT"
      renderContent={
        <p className="icon-controll-container ">
          <Icon img={SettingsIcon} fill="#000" />
          <span>Размеры колонок</span>
        </p>
      }
      width="150px"
      padding="15px"
      top="100%"
      left="0%"
    >
      <Item
        callback={() => {
          tableStore.resizerMode = ResizeMode.SCROLL;
        }}
        title="С прокруткой"
      />
      <Item
        callback={() => {
          tableStore.resizerMode = ResizeMode.NEXTCOLUMN;
        }}
        title="Без прокрутки"
      />
      <Item
        callback={() => {
          tableElement.current.style.gridTemplateColumns = generateColumnsSize(
            tableStore.smartColumns,
          );
        }}
        title="Стартовый"
      />
    </DropdownContainer>
  );
};
