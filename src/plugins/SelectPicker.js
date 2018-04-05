import assign from 'lodash.assign';

const DEFAULT_OPTIONS = {
  selector: '.selectpicker',
  picker: {

  }
};

export default (params = {}) => {
  const options = assign({}, DEFAULT_OPTIONS, params);

  return {
    drawControlsState() {
      this.jquery(options.selector).picker(options.picker); //init select picker only when controls are restored from state to load default value
    },
  }
}