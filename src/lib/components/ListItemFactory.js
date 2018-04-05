export default (options) => ({
  name: 'list-item',
  props: ['item'],
  template: options.templates.item.template || options.templates.item,
  ...options.templates.item
});