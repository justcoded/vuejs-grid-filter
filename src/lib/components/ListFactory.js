import ListItemFactory from './ListItemFactory.js';
import ListPlaceholderFactory from './ListPlaceholderFactory.js';

export default (options) => ({
  name: 'list',
  props: ['items'],
  components: {
    'list-item': ListItemFactory(options),
    'list-placeholder': ListPlaceholderFactory(options)
  },
  template: options.templates.list.template || options.templates.list,
  ...options.templates.list
})