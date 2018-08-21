jQuery(function ($) {
  function initFilter() {
    const pagination = {
      total: 0,
      current: 1,
      perPage: 5,
    };

    var filter = new JustFilter({
      elements: {
        filter: '[data-role="search-filter"]'
      },
      vue: Vue,
      jquery: $,
      templates: {
        item: `
          <div class="col-md-4">
              <div class="panel panel-default">
                  <div class="panel-heading">
                      <h3 class="panel-title"><b>{{item.title}}</b></h3>
                  </div>
                  <div class="panel-body">
                      <div class="image">
                          <img :src="item.image" />
                      </div>
                      <div class="description">
                          {{item.description}}
                      </div>
                  </div>
              </div>
          </div>
        `,
        placeholder: `
        <div class="col-md-12">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title"><b>No Items Was Found</b></h3>
                </div>
            </div>
        </div>
      `
      },
      getRequestUrl: (state) => {
        return JustFilter.defaults.getRequestUrl(state).replace(
          location.protocol + '//' + location.host + location.pathname,
          'http://localhost:3000/posts'
        );
      },
    });

    filter.use({
      getControlsState() {
        const state = this._super();

        state.pagination.perPage = pagination.perPage;
        state.pagination.page = pagination.current;

        return state;
      },
      afterServerResponseCb(data) {
        pagination.total = data.total;
      },
      drawControlsState(state) {
        if (state.pagination.perPage) {
          pagination.perPage = state.pagination.perPage;
        }

        if (state.pagination.page) {
          pagination.current = state.pagination.page;
        }
      },
      beforeReloadItemsCb(newState, prevState) {
        const isFilterChanged = JSON.stringify([newState.sort, newState.filter]) !== JSON.stringify([prevState.sort, prevState.filter]);

        if (isFilterChanged) {
          newState.pagination.page = pagination.current = 1;
        }
      },
    });

    filter.init();

    var vm = new Vue({
      el: 'main',
      data() {
        return {
          pagination,
        }
      },
      computed: {
        pages() {
          return Array.from({length: Math.ceil(this.pagination.total / pagination.perPage)}, (value, index) => index + 1);
        }
      },
      methods: {
        applyPagination(page) {
          filter.setState({
            pagination: {
              page,
              perPage: pagination.perPage,
            }
          });

          this.pagination.current = page;
        },
        isCurrentPage(page) {
          return this.pagination.current === page;
        }
      }
    });
  }

  initFilter();
});