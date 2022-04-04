import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from '@jitcoder/usestore';
import SpreadSheet from '@equals-demo/engine';
import registerFunctions from './register-functions';

const sheet = new SpreadSheet();

registerFunctions(sheet);
store.set('app.sheet', sheet);

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
