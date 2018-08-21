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
      }
    });

    filter.use(JustFilter.Plugins.SelectPagination());
    filter.use(JustFilter.Plugins.SelectSorting());

    filter.init();

    var vm = new Vue({
      el: 'main'
    });
  }

  initFilter();
});