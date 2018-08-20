jQuery(function ($) {
  /**
   * Some demo specific behaviour, it's not important for filter itself
   */
  function initUI() {
    function initSortingUI() {
      var sortingInput = $('[data-role="search-sort"]');
      var sortingDirInput = $('[data-role="search-sort-dir"]');

      sortingInput.on('change', function () {
        var input = $(this);

        if (input.find('option:selected').data('sortDirInput')) {
          sortingDirInput.show();
        } else {
          sortingDirInput.hide();
        }
      });
    }

    initSortingUI();
  }

  function initFilter() {
    var filter = new JustFilter({
      elements: {
        filter: '[data-role="search-filter"]'
      },
      vue: Vue,
      jquery: $,
      templates: {
        item: `
        <div class="grid-item">
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
        <div class="grid-placeholder" style="width: 100%;">
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

    filter.use(JustFilter.Plugins.Masonry({
      masonry: {
        itemSelector: '.grid-item',
        columnWidth: 100
      }
    }));
    filter.use(JustFilter.Plugins.SelectPagination());

    filter.init();

    var vm = new Vue({
      el: 'main'
    });
  }

  initUI();
  initFilter();
});