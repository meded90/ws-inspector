/// <reference types="chrome"/>
import React from 'react';
import ReactDOM from 'react-dom';
import './reset.css';
import App from './viewer/App';
import { createStores } from './stores/RootStore';
import { Provider } from 'mobx-react';

const stores = createStores();
// @ts-ignore
window.stores = stores;
ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById('root')
);
