jQuery(function ($) {
  function initFilter() {
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
      },
      getRequestUrl: (state) => {
        return JustFilter.defaults.getRequestUrl(state).replace(
          location.protocol + '//' + location.host + location.pathname,
          'http://localhost:3000/posts'
        );
      },
      serializeStateToUrl: function (state, queryString) {
        const search = queryString.stringify({
          ...state.filter,
          ...state.sort,
        });

        return location.protocol + '//' + location.host + location.pathname
          + (search ? ('?' + search) : '');
      },
      deserializeUrlToState: function (queryLib, normalizeValues) {
        const query = queryLib.parse(location.search.replace(/^\?/, ''));

        return {
          filter: normalizeValues(query) || {},
          sort: normalizeValues(query) || {},
          pagination: {
            page: parseInt(query['p']) || null,
            perPage: parseInt(query['pp']) || null
          }
        }
      },
    });

    filter.init();

    var vm = new Vue({
      el: 'main'
    });
  }

  initFilter();
});