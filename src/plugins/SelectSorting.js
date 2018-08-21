import assign from 'lodash.assign';

const DEFAULT_OPTIONS = {
  sortingSelectSelector: '[data-role="search-sort"]',
};

export default (params = {}) => {
  const options = assign({}, DEFAULT_OPTIONS, params);

  return {
    getControlsState() {
      const state = this._super();

      const sortingSelect = this.jquery(options.sortingSelectSelector);

      const name = sortingSelect.val().split(':')[0];
      let sortDir = sortingSelect.val().split(':')[1];

      if (!sortDir) {
        const selectedOption = sortingSelect.find('option:selected');
        const sortDirEl = this.jquery(selectedOption.data('sortDirInput'));

        sortDir = sortDirEl.val();
      }

      state.sort[name] = sortDir;

      return state;
    },
    getSortingDirSelects() {
      const sortingSelect = this.jquery(options.sortingSelectSelector);

      return sortingSelect.find('[data-sort-dir-input]')
        .toArray().map(
            (option) => this.jquery(this.jquery(option).data('sortDirInput')));
    },
    initSortingDirSelect() {
      const sortingSelect = this.jquery(options.sortingSelectSelector);
      const handleSelectChange = () => {
        this.getSortingDirSelects().forEach((select) => select.hide());

        const relatedSortingDirSelect = this.jquery(sortingSelect.find('option:selected').data('sortDirInput'));

        relatedSortingDirSelect.show()
      };

      sortingSelect.on('change', handleSelectChange);
      handleSelectChange();
    },
    drawControlsState(controlsState) {
      const sortingSelect = this.jquery(options.sortingSelectSelector);

      for (let sortName in controlsState.sort) {
        const sortDir = controlsState.sort[sortName];

        const options = sortingSelect.find('option').toArray();

        options.some((el) => {
          const option = $(el);
          const optionSortName = option.val().split(':')[0];
          let optionSortDir = option.val().split(':')[1];
          let optionSortDirInput;

          if (!optionSortDir) {
            optionSortDirInput = this.jquery(option.data('sortDirInput'));

            optionSortDir = optionSortDirInput.find('option').toArray().map((el) => this.jquery(el).val())
          } else {
            optionSortDir = [optionSortDir];
          }

          if (sortName === optionSortName && optionSortDir.indexOf(sortDir) !== -1) {
            sortingSelect.val(option.val());

            if (optionSortDirInput) {
              if (optionSortDirInput.length > 1) {
                optionSortDirInput = optionSortDirInput.filter(`[value="${sortDir}"]`)[0]
              }

              this.jquery(optionSortDirInput).val(sortDir);
            }

            return true;
          }

          return false;
        });
      }

      this.initSortingDirSelect();
    },
    registerItemsUpdater(update) {
      this.jquery(options.sortingSelectSelector).change(() => update());
      this.getSortingDirSelects().forEach((select) => select.change(() => update()));
    },
  }
}