import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Counter from './components/Counter';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
  <React.StrictMode>
    <Counter />
  </React.StrictMode>,
  document.getElementById('root')
);
