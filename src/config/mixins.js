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
          obj.objectMixin('from inside mGetData')
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

const objectMixin = {
  types: ['GenericObject'],
  init(args) {},
  extend: {
    objectMixin(msg) {
      console.log('layout mixin', msg)
      this.getLayout().then((layout) => {
        console.log("Layout: ", layout)
      })
    }
  },
}

const objectMixin2 = {
  types: ['GenericObject'],
  init(args) {},
  extend: {
    objectMixin2() {
      console.log('layout mixin #2')
      this.getLayout().then((layout) => {
        console.log("Layout #2: ", layout)
      })
    }
  },
}

export {
  docMixin, objectMixin, objectMixin2
};