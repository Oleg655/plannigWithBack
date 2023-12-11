import React, { StrictMode } from 'react';

import { spy } from 'mobx';
import ReactDOM from 'react-dom';

import { App } from './App';
import './index.css';

// spy(ev => {
//   console.log(ev);
// });
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.querySelector('#root'),
);
