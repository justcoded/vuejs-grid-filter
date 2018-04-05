import assign from 'lodash.assign';
import debounce from 'debounce';

const DEFAULT_OPTIONS = {
  debounce: 350
};

export default (params = {}) => {
  const options = assign({}, DEFAULT_OPTIONS, params);

  return {
    registerItemsUpdater(update) {
      this.jquery(this.getControlInputs()).on('change input', debounce(() => {
        update();
      }, options.debounce));
    }
  }
}