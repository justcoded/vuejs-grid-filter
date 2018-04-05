jQuery(function ($) {
  /**
   * Some demo specific behaviour, it's not important for filter itself
   */
  function initUI() {
    /**
     * This will init sorting behaviour - hide/show sort dirt input, skip this if you will no need to implement this on you project
     */
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
      vue: Vue,
      jquery: $,
      templates: {
        item: `
        <div class="col-md-4">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title" v-html="item.title.rendered"></h3>
                </div>
                <div class="panel-body">
                    <div class="description" v-html="item.excerpt.rendered"></div>
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
      url: 'https://demo.wp-api.org/wp-json/wp/v2/posts',
      // TODO it will work only if initialItems length equals to perPage (issue in source code)
      initialItems: [
        {
          title: {
            rendered: 'Page Preload 1 Title 1'
          },
          excerpt: {
            rendered: 'Page Preload 1 Excerpt 1'
          }
        },
        {
          title: {
            rendered: 'Page Preload 1 Title 2'
          },
          excerpt: {
            rendered: 'Page Preload 1 Excerpt 2'
          }
        },
        {
          title: {
            rendered: 'Page Preload 1 Title 3'
          },
          excerpt: {
            rendered: 'Page Preload 1 Excerpt 3'
          }
        },
        {
          title: {
            rendered: 'Page Preload 1 Title 4'
          },
          excerpt: {
            rendered: 'Page Preload 1 Excerpt 4'
          }
        },
        {
          title: {
            rendered: 'Page Preload 1 Title 5'
          },
          excerpt: {
            rendered: 'Page Preload 1 Excerpt 5'
          }
        },
        {
          title: {
            rendered: 'Page Preload 1 Title 6'
          },
          excerpt: {
            rendered: 'Page Preload 1 Excerpt 6'
          }
        },
        {
          title: {
            rendered: 'Page Preload 1 Title 7'
          },
          excerpt: {
            rendered: 'Page Preload 1 Excerpt 7'
          }
        },
        {
          title: {
            rendered: 'Page Preload 1 Title 8'
          },
          excerpt: {
            rendered: 'Page Preload 1 Excerpt 8'
          }
        },
        {
          title: {
            rendered: 'Page Preload 1 Title 9'
          },
          excerpt: {
            rendered: 'Page Preload 1 Excerpt 9'
          }
        }
      ],
    });

    filter.use(JustFilter.Plugins.WpRest());
    filter.use(JustFilter.Plugins.AutoLoad());
    filter.use(JustFilter.Plugins.LoadMore({
      perPage: 9,
    }));
    filter.use(JustFilter.Plugins.Separator({
      after: 6,
      el: '#featured-posts'
    }));

    filter.init();

    var vm = new Vue({
      el: 'main'
    });
  }

  initUI();
  initFilter();
});