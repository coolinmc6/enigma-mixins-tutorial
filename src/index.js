import React from 'react';
import { render } from 'react-dom';
import './css/styles.scss';

import appPromise from './config/app';


const hypercube = {
  qInfo: { qId: 'Sales by Year', qType: 'data'},
  qHyperCubeDef: {
    qDimensions: [
      // { qDef: { qFieldDefs: ['[Country]']} },
      { qDef: { qFieldDefs: ['[Product Group Desc]']} }
    ],
    qMeasures: [
      { qDef: { qDef: 'SUM([Sales Margin Amount])'}, },
    ],
    qInitialDataFetch: [{
      qTop: 0, qLeft: 0, qWidth: 10, qHeight: 1000,
    }],
    qInterColumnSortOrder: [],
    qSuppressZero: true,
    qSuppressMissing: true,
  }
}

const App = () => {
  (async () => {
    const app = await appPromise;

    // Method #1: Basic
    // app.myMixin()

    // // Method #2: Complex #1
    const data = await app.mGetData({ object: hypercube })
    console.log(data)

    // // Method #3: Complex #2
    // const table = await app.mPrintTable({ object: hypercube })
    // console.log(table);

    // // Method #4: Object Mixin #1
    // app.createSessionObject(hypercube).then((obj) => {
    //   console.log(obj)
    //   obj.objectMixin('hey there')
    // })

    // Method #5: Object Mixin #2
    // app.createSessionObject(hypercube).then((obj) => {
    //   console.log(obj)
    //   obj.objectMixin2('hey there')
    // })
  })()
  return (
    <div>
      <h1>Enigma.js Mixins Tutorial</h1>
    </div>
  )
}

render(<App />, document.getElementById('root'));
