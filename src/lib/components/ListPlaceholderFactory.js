export default (options) => ({
  name: 'list-placeholder',
  template: options.templates.placeholder.template || options.templates.placeholder,
  ...options.templates.placeholder
})