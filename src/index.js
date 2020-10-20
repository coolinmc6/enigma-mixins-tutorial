import React from 'react';
import { render } from 'react-dom';
import './css/styles.scss';

import MyChart from './MyChart';

const App = () => {
  (async () => {
    const apple = new Promise((res) => {
      setTimeout(() => {
        res('apple');
      }, 3000)
    })

    const _apple = await apple;
    console.log(_apple);
  })()
  return (
    <div>
      <h1>Qdt-Components 3.0 Tutorial</h1>
      <MyChart />
    </div>
  )
}

render(<App />, document.getElementById('root'));
