import assign from 'lodash.assign';

const DEFAULT_OPTIONS = {
  packery: {
    transitionDuration: 0
  }
};

export default (params = {}) => {
  const options = assign({}, DEFAULT_OPTIONS, params);

  return {
    afterItemsDrawCb() {
      const grid = this.jquery(this.elements.list);

      const initPackery = () => {
        grid.packery(options.packery).packery('reloadItems').packery('layout');
      };

      grid.imagesLoaded().progress(initPackery);

      initPackery();
    },
  }
}