import assign from 'lodash.assign';

const DEFAULT_OPTIONS = {
  wow: {},
  lib: typeof WOW !== 'undefined' ? WOW : null
};

export default (params = {}) => {
  const options = assign({}, DEFAULT_OPTIONS, params);

  let wowNeedReload = true;

  return {
    afterItemsDrawCb: function () {
      if (wowNeedReload) {
        new options.lib(options.wow).init();

        wowNeedReload = false;
      }
    },
    beforeInitCb: function () {
      this.jquery(this.getControlInputs()).on('change input', function () {
        wowNeedReload = true;
      });
    }
  }
}