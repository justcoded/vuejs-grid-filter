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
        <div class="col-md-4 wooow" :class="(() => {
          const items = ['rubberBand', 'bounce', 'flash', 'pulse', 'shake', 'swing', 'tada'];
          
          return items[Math.floor(Math.random() * items.length)];
        })()">
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
      url: 'http://localhost:3000/posts'
    });

    filter.use(JustFilter.Plugins.AutoLoad({
        debounce: 500
    }));

    filter.use(JustFilter.Plugins.LoadMore({
      perPage: 9,
      loadMoreSelector: '[data-role="search-load-more"]',
      loadMoreEvent: 'click'
    }));

    filter.use(JustFilter.Plugins.Wow({
      wow: {
        boxClass: 'wooow'
      }
    }));

    filter.use(JustFilter.Plugins.Packery({
      packery: {
        transitionDuration: 3000
      }
    }));

    filter.use(JustFilter.Plugins.SelectSorting());

    filter.init();

    var vm = new Vue({
      el: 'main'
    });
  }

  initFilter();
});