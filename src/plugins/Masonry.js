import assign from 'lodash.assign';

const DEFAULT_OPTIONS = {
  masonry: {
    itemSelector: '.grid-item'
  }
};

export default (params = {}) => {
  const options = assign({}, DEFAULT_OPTIONS, params);

  return {
    afterItemsDrawCb: function () {
      const grid = this.jquery(this.elements.list);

      const initMasonry = () => {
        grid.masonry(options.masonry).masonry('reloadItems');
      };

      grid.imagesLoaded().progress(initMasonry);

      initMasonry();
    }
  }
}