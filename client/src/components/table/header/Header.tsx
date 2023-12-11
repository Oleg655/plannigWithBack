import React from 'react';

import { SuntdHeader } from 'k6-ui/v2';

export const Header = () => {
  const themes = [
    { label: 'Стандартная', value: 'kApp-Header-theme-standard' },
    { label: 'Тёмная', value: 'kApp-Header-theme-black' },
    { label: 'Камаз', value: 'kApp-Header-theme-414100010' },
    { label: 'Транснефть', value: 'kApp-Header-theme-414100039' },
    { label: 'ОДК', value: 'kApp-Header-theme-414100183' },
    { label: 'Ильюшин', value: 'kApp-Header-theme-414100196' },
    { label: 'ОСК', value: 'kApp-Header-theme-414100222' },
    { label: 'Атомэнергопроект', value: 'kApp-Header-theme-414100265' },
    { label: 'Лукойл', value: 'kApp-Header-theme-414100338' },
  ];
  return (
    <SuntdHeader
      additionalInfo="additional info"
      controls
      // fetchSystemName={function noRefCheck() {}}
      hintIconTitle="Справка"
      homeIcon
      // linksForDropdown={[
      //   {
      //     path: '/',
      //     title: 'Подсистема замечаний',
      //   },
      //   {
      //     path: '/',
      //     title: 'Контроль оборота НД',
      //   },
      //   {
      //     path: '/',
      //     title: 'Конструктор НД',
      //   },
      // ]}
      sourceLink="/docs"
      sourceLinks={[
        {
          path: '/',
          title: 'homepage',
        },
        {
          path: '/dropdowns',
          title: 'dropdowns',
        },
        {
          path: '/tooltips',
          title: 'tooltips',
        },
      ]}
      sourceTitle="source title"
      systemName={themes[0].value}
      title="Планирование разработки НД"
      userName="kodeks"
      version="version"
    />
  );
};
