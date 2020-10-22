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
  }
}

export {
  docMixin,
};