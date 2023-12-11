import React from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';
import { PATHS } from 'types';

export const dataPATH: any[] = [];

export const RoutesPath = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={PATHS.LOGIN} />} />
      {dataPATH.map(route => (
        <Route path={route.path} element={route.element} key={route.path} />
      ))}
      <Route path={'/*'} element={<Navigate to={PATHS.NOT_FOUND} />} />
    </Routes>
  );
};
