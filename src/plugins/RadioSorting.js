import assign from 'lodash.assign';

const DEFAULT_OPTIONS = {
  sortingRadioSelector: '[data-role="search-sort"]',
  sortingDirRadioWrapperSelector: '[data-role="search-sort-dir-wrapper"]',
};

export default (params = {}) => {
  const options = assign({}, DEFAULT_OPTIONS, params);

  return {
    getControlsState() {
      const state = this._super();

      const sortingRadio = this.jquery(options.sortingRadioSelector).filter(':checked');

      const name = sortingRadio.val().split(':')[0];
      let sortDir = sortingRadio.val().split(':')[1];

      if (!sortDir) {
        const sortDirEl = this.jquery(sortingRadio.data('sortDirInput')).filter(':checked');

        sortDir = sortDirEl.val();
      }

      state.sort[name] = sortDir;

      return state;
    },
    getSortingDirRadios() {
      const sortingRadio = this.jquery(options.sortingRadioSelector);

      return sortingRadio.filter('[data-sort-dir-input]')
        .toArray().map(
            (option) => this.jquery(this.jquery(option).data('sortDirInput')));
    },
    initSortingDirSelect() {
      const sortingRadio = this.jquery(options.sortingRadioSelector);
      const handleSelectChange = () => {
        this.getSortingDirRadios().forEach((radio) => radio.closest(options.sortingDirRadioWrapperSelector).hide());

        const relatedSortingDirRadio = this.jquery(sortingRadio.filter(':checked').data('sortDirInput')).closest(options.sortingDirRadioWrapperSelector);

        relatedSortingDirRadio.show()
      };

      sortingRadio.on('change', handleSelectChange);
      handleSelectChange();
    },
    drawControlsState(controlsState) {
      const sortingRadio = this.jquery(options.sortingRadioSelector);

      for (let sortName in controlsState.sort) {
        const sortDir = controlsState.sort[sortName];

        sortingRadio.toArray().some((el) => {
          const option = $(el);
          const optionSortName = option.val().split(':')[0];
          let optionSortDir = option.val().split(':')[1];
          let optionSortDirInput;

          if (!optionSortDir) {
            optionSortDirInput = this.jquery(option.data('sortDirInput'));

            optionSortDir = optionSortDirInput.toArray().map((el) => this.jquery(el).val());
          } else {
            optionSortDir = [optionSortDir];
          }

          if (sortName === optionSortName && optionSortDir.indexOf(sortDir) !== -1) {
            option.prop('checked', true);

            if (optionSortDirInput) {
              if (optionSortDirInput.length > 1) {
                optionSortDirInput = optionSortDirInput.filter(`[value="${sortDir}"]`)[0]
              }

              this.jquery(optionSortDirInput).prop('checked', true);
            }

            return true;
          }

          return false;
        });
      }

      this.initSortingDirSelect();
    },
    registerItemsUpdater(update) {
      this.jquery(options.sortingRadioSelector).change(() => update());
      this.getSortingDirRadios().forEach((radio) => radio.change(() => update()));
    },
  }
}