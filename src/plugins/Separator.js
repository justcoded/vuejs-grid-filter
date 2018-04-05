import assign from 'lodash.assign';

const DEFAULT_OPTIONS = {
  after: 6,
  showIfNoPostsFound: true,
  content: '',
  el: null
};

//TODO it will not work if list template is redefined
export default (params = {}) => (lib) => {
  const options = assign({}, DEFAULT_OPTIONS, params);

  const content = options.content || lib.jquery(options.el).html();

  return {
    templates: {
      list: {
        template: `
          <div class="filter-list-separator-wrapper">
            <template v-if="!items.length">
              <list-placeholder></list-placeholder>
            </template>
            
            <div v-if="bunches[0].length" class="filter-list-wrapper" data-role="search-result">
              <template v-for="(item, index) in bunches[0]">
                <list-item :item="item" :key="index"></list-item>
              </template>
            </div>
            
            <div v-if="items.length || showIfNoPostsFound" class="post-separator" v-html="content"></div>

            <div v-if="bunches[1].length" class="filter-list-wrapper" data-role="search-result">
              <template v-for="(item, index) in bunches[1]">
                <list-item :item="item" :key="index"></list-item>
              </template>
            </div>
          </div>
        `,
        data: () => ({
          showIfNoPostsFound: options.showIfNoPostsFound,
          after: options.after,
          content
        }),
        computed: {
          /**
           * @TODO now it supports only two bunches separation (interval should be added)
           */
          bunches() {
            return [
              this.items.slice(0, this.after),
              this.items.slice(this.after),
            ]
          }
        }
      }
    }
  }
}