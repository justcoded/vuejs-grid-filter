import assign from 'lodash.assign';
import debounce from 'debounce';

const DEFAULT_OPTIONS = {
  debounce: 350,
  events: 'change input'
};

export default (params = {}) => {
  const options = assign({}, DEFAULT_OPTIONS, params);

  return {
    registerItemsUpdater(update) {
      this.jquery(this.getControlInputs()).on(options.events, debounce(() => {
        update();
      }, options.debounce));
    }
  }
}