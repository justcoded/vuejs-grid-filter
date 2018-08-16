jQuery(function ($) {
  /**
   * Some demo specific behaviour, it's not important for filter itself
   */
  function initUI() {
    function initCustomPlugins() {
      $('.select2-select').select2();
      $('.touch-spin').TouchSpin();
      //$('.selectpicker').picker(); // because of it's doesn't handle input change events we need to init it when filter plugin has been drown itself
    }
    function initSortingUI() {
      var sortingInput = $('[data-role="search-sort"]');
      var sortingDirInputWrapper = $('[data-role="search-sort-dir-wrapper"]');

      sortingInput.on('change', function () {
        var input = $(this);

        if (input.data('sortDirInput')) {
          sortingDirInputWrapper.show();
        } else {
          sortingDirInputWrapper.hide();
        }
      });
    }

    initCustomPlugins();
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
      url: 'http://localhost:3000/posts'
    });

    filter.use(JustFilter.Plugins.SelectPicker({
      selector: '.selectpicker',
      picker: {
        coloring: {
          'red' : 'red',
          'blue' : 'blue',
          'white' : 'white'
        }
      }
    }));

    filter.use(JustFilter.Plugins.InfinityScroll({
      perPage: 8,
      scrollOffset: 200
    }));

    filter.init();

    var vm = new Vue({
      el: 'main'
    });
  }

  initUI();
  initFilter();
});