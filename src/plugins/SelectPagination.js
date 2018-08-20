import assign from 'lodash.assign';

const DEFAULT_OPTIONS = {
  perPage: 10,
  selectedPage: 1,
  pageSelectSelector: '[data-role="search-page"]',
  perPageSelectSelector: '[data-role="search-per-page"]',
};

export default (params = {}) => {
  const options = assign({}, DEFAULT_OPTIONS, params);

  let isNeedForRefresh = false;

  return {
    getPaginationControlInputs() {
      return this.jquery(`${options.pageSelectSelector},${options.perPageSelectSelector}`);
    },
    drawControlsState(controlsState) {
      this.jquery(options.pageSelectSelector).val(controlsState.pagination.page);
      this.jquery(options.perPageSelectSelector).val(controlsState.pagination.perPage);
    },
    getControlsState() {
      const state = this._super();

      state.pagination.page = parseInt(this.jquery(options.pageSelectSelector).val()) || options.selectedPage;
      state.pagination.perPage = parseInt(this.jquery(options.perPageSelectSelector).val()) || options.perPage;

      return state;
    },
    registerItemsUpdater: {
      handler(update, getRequestedState) {
        this._super(() => {
          isNeedForRefresh = true;
        }, getRequestedState);

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
      before: true,
    },
    beforeReloadItemsCb(state) {
      if (isNeedForRefresh) { // we will reset pagination on any filter/sorting change
        state.pagination.page = 1;

        isNeedForRefresh = false;
      }
    },
    afterServerResponseCb(data, state) {
      const perPage = state.pagination.perPage;

      this.drawPaginationPages(Math.ceil(data.total / perPage));
      this.drawControlsState(state);
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