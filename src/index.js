import React from 'react';
import { render } from 'react-dom';
import './css/styles.scss';

import appPromise from './config/app';

const App = () => {
  (async () => {
    const app = await appPromise;
    app.myMixin()
  })()
  return (
    <div>
      <h1>Enigma.js Mixins Tutorial</h1>
    </div>
  )
}

render(<App />, document.getElementById('root'));
