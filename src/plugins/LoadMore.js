import assign from 'lodash.assign';

const DEFAULT_OPTIONS = {
  perPage: 7,
  total: Infinity,
  loadMoreSelector: '[data-role="search-load-more"]',
  loadMoreEvent: 'click',
};

export default (params = {}) => {
  const options = assign({}, DEFAULT_OPTIONS, params);

  let currentPage = 1;
  let isPaginationNeedToBeRefreshed = false;

  const setLoadMoreButtonAvailability = (status, jquery) => {
    jquery(options.loadMoreSelector).prop('disabled', !status);
  };

  return {
    loadControlsState: function () {
      const state = this._super();

      // TODO it will work only if initialItems length equals to perPage (in other case some items from page can be missed)
      state.pagination.page = Math.ceil(this.initialItems.length / options.perPage) || 1;
      state.pagination.perPage = options.perPage;

      return state;
    },
    getControlsState: function () {
      const state = this._super();

      state.pagination.perPage = options.perPage;
      state.pagination.page = currentPage;

      return state;
    },
    beforeInitCb: function (appData) {
      setLoadMoreButtonAvailability(appData.items.length < options.total, this.jquery)
    },
    afterItemsDrawCb: function () {
      isPaginationNeedToBeRefreshed = false;
    },
    parseResponse: function (response, status, xhr, app) {
      const data = this._super(response, status, xhr, app);

      if (!isPaginationNeedToBeRefreshed) {
        data.items = app.items.concat(data.items);
      }

      return data;
    },
    beforeReloadItemsCb: function (state) {
      if (isPaginationNeedToBeRefreshed) {
        state.pagination.page = currentPage = 1;
        state.pagination.perPage = options.perPage;
      }
    },
    registerItemsUpdater: function (update, getRequestedState) {
      this._super((state) => {
        isPaginationNeedToBeRefreshed = true;
      }, getRequestedState);

      this.jquery(document).on(options.loadMoreEvent, options.loadMoreSelector, () => {
        const state = getRequestedState(false);

        state.pagination.page = state.pagination.page + 1;

        update(state);
      });
    },
    afterServerResponseCb: function (data) {
      setLoadMoreButtonAvailability(data.items.length < data.total, this.jquery)
    },
    saveControlsState: function (state) {
      this._super(state, (state) => {
        delete state['p'];
        delete state['pp'];
      });
    }
  }
}