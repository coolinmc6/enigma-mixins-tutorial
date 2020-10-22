const docMixin = {
  types: ['Doc'],
  init(args) {},
  extend: {
    myMixin() {
        console.log('myMixin was called - this is all it does');
    },
    mGetData({ object }) {
      return new Promise((res) => {
        this.createSessionObject(object).then((obj) => {
          console.log(obj)
          obj.getLayout().then((layout) => {
            const data = layout.qHyperCube.qDataPages;
            res(data);
          })
        })
      })
    },
    mPrintTable({ object }) {
      return new Promise((res) => {
        this.mGetData({ object }).then((qObj) => {
          const table = []
          qObj[0].qMatrix.map((o) => {
            const row = {}
            o.map((c,i) => {
              let val = c.qNum === "NaN" ? c.qText : c.qNum
              row[`c${i}`] = val;
            })
            table.push(row);
          })
          console.table(table);
          res(table);
        })
      })
    },
  }
}

export {
  docMixin,
};