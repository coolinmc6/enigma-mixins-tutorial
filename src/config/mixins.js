const docMixin = {
  types: ['Doc'],
  init(args) {},
  extend: {
    myMixin() {
        console.log('myMixin was called - this is all it does');
    },
  }
}

export {
  docMixin,
};