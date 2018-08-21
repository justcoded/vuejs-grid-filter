import assign from 'lodash.assign';

const DEFAULT_OPTIONS = {
  perPage: 10,
  selectedPage: 1,
  pageSelectSelector: '[data-role="search-page"]',
  perPageSelectSelector: '[data-role="search-per-page"]',
};

export default (params = {}) => {
  const options = assign({}, DEFAULT_OPTIONS, params);

  return {
    getPaginationControlInputs() {
      return this.jquery(`${options.pageSelectSelector},${options.perPageSelectSelector}`);
    },
    drawControlsState(controlsState) {
      this.drawPaginationControlsState(controlsState);
    },
    drawPaginationControlsState(controlsState) {
      const pageSelect = this.jquery(options.pageSelectSelector);

      // append temporary option in a case if pages doesn't rendered yet
      if (!pageSelect.find(`option[value="${controlsState.pagination.page}"]`).length) {
        pageSelect.append(
          this.jquery('<option>')
            .val(controlsState.pagination.page)
            .html(controlsState.pagination.page)
        );
      }

      this.jquery(options.pageSelectSelector).val(controlsState.pagination.page);
      this.jquery(options.perPageSelectSelector).val(controlsState.pagination.perPage);
    },
    getControlsState() {
      const state = this._super();

      state.pagination.page = parseInt(this.jquery(options.pageSelectSelector).val()) || options.selectedPage;
      state.pagination.perPage = parseInt(this.jquery(options.perPageSelectSelector).val()) || options.perPage;

      return state;
    },
    registerItemsUpdater(update, getRequestedState) {
      this.jquery(options.pageSelectSelector).change(() => update());
      this.jquery(options.perPageSelectSelector).change((ev) => {
        const state = getRequestedState();

        update({
          ...state,
          pagination: {
            ...state.pagination,
            page: 1,
            perPage: this.jquery(ev.target).val(),
          }
        });
      });
    },
    beforeReloadItemsCb(newState, prevState) {
      const isFilterChanged = JSON.stringify([newState.sort, newState.filter]) !== JSON.stringify([prevState.sort, prevState.filter]);

      if (isFilterChanged) {
        newState.pagination.page = 1;
      }
    },
    afterServerResponseCb(data, state) {
      const perPage = state.pagination.perPage;

      this.drawPaginationPages(Math.ceil(data.total / perPage));
      this.drawPaginationControlsState(state);
    },
    drawPaginationPages(pages) {
      const pageSelect = this.jquery(options.pageSelectSelector);

      pageSelect.html('');

      for (let i = 1; i <= pages; i++) {
        pageSelect.append(this.jquery('<option>').val(i).html(i));
      }
    }
  }
}