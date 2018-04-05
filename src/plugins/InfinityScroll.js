import assign from 'lodash.assign';

const DEFAULT_OPTIONS = {
  perPage: 7,
  total: Infinity,
  scrollOffset: 200
};

export default (params = {}) => {
  const options = assign({}, DEFAULT_OPTIONS, params);

  let currentPage = 1;
  let isPaginationLocked = false;
  let isPaginationEnd = false;
  let isPaginationNeedToBeRefreshed = false;

  return {
    loadControlsState() {
      let state = this._super();

      // TODO it will work only if initialItems length equals to perPage (in other case some items from page can be missed)
      state.pagination.page = Math.ceil(this.initialItems.length / options.perPage) || 1;
      state.pagination.perPage = options.perPage;

      return state;
    },
    getControlsState() {
      let state = this._super();

      state.pagination.perPage = options.perPage;
      state.pagination.page = currentPage;

      return state;
    },
    beforeInitCb: function (appData) {
      isPaginationEnd = options.total <= appData.items.length
    },
    afterItemsDrawCb: function () {
      isPaginationLocked = false;
      isPaginationNeedToBeRefreshed = false;
    },
    parseResponse: function (response, status, xhr, app) {
      const data = this._super(response, status, xhr, app);

      if (!isPaginationNeedToBeRefreshed) {
        data.items = app.items.concat(data.items);
      }

      return data;
    },
    beforeReloadItemsCb(state) {
      if (isPaginationNeedToBeRefreshed) {
        state.pagination.page = currentPage = 1;
        state.pagination.perPage = options.perPage;

        isPaginationLocked = false;
      }
    },
    registerItemsUpdater: {
      handler(update, getRequestedState) {
        this._super((state) => {
          isPaginationNeedToBeRefreshed = true;
        }, getRequestedState);

        let $window = this.jquery(window);
        let $document = this.jquery(document);

        $window.scroll(() => {
          if (isPaginationLocked || isPaginationEnd) {
            return;
          }

          if ($window.scrollTop() + $window.height() >= $document.height() - options.scrollOffset) {
            currentPage++;
            isPaginationLocked = true;

            let state = getRequestedState(false);

            if (state.pagination.page === currentPage) {
              return; // page is already loaded skip other load requests
            }

            state.pagination.page = state.pagination.page + 1;

            update(state);
          }
        });
      },
      before: true
    },
    afterServerResponseCb(data) {
      if (data.total <= data.items.length) {
        isPaginationEnd = true;
      } else {
        isPaginationEnd = false;
      }
    },
    saveControlsState(state) {
      this._super(state, (state) => {
        delete state['p'];
        delete state['pp'];
      })
    }
  }
}