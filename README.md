# Just Filter

## Purpose
    
This module provides filtered view of posts (or any kind of listing data), filtering/pagination/sorting should be realized on backend.

You can get more info about it just checking the examples in `demo/frontend` folder (don't forget to run `cd demo/backend; node index.js;`

## Installation

While this module is private you can install it only from this private repo (please note that you should have access to this repo, and you need add SSH key to Bitbucket before [instruction](https://confluence.atlassian.com/bitbucket/set-up-an-ssh-key-728138079.html)):

```sh
npm install https://github.com/justcoded/vuejs-grid-filter.git --save
```

## Usage

Import lib:
```javascript
// In a case you are not using build tools just add lib with `script` tag, and it will be available globally: `window.JustFilter` and `window.JustFilter.Plugins`
import JustFilter, {Plugins} from 'just-filter';

// Create instance of filter
const filter = new JustFilter({
    jquery: $, // you need to pass your instace of jQuery to lib, it's important to pass same instace which was used for your jQuery plugins
    vue: Vue, // pass instance of Vue to lib (module will register `jc-filter-list` component for you)
    templates: {
        // template for your list item (this is just Vue template, and `item` object represanting item from backend)
        item: `
          <div class="list-item">
              <div class="list-item-wrapper">
                  <div class="list-item-heading">
                      <h3 class="list-item-title"><b>{{item.title}}</b></h3>
                  </div>
                  <div class="list-item-body">
                      <div class="list-item-image">
                          <img :src="item.image" />
                      </div>
                      <div class="description">
                          {{item.description}}
                      </div>
                  </div>
              </div>
          </div>
    `
  }
});

// Init some plugins if you need (check list of of available plugins bellow)
filter.use(Plugins.InfinityScroll({
    perPage: 8,
    scrollOffset: 200
}));

// Init instace of filter
filter.init();

// Init vue (you can put this initialization whereever you want it's up to you, but it should be after you initialize filter)
var vm = new Vue({
    el: 'main'
});
```

## Plugins

Filter comes with list of often used plugins, so you can use them out from box (or you can write it itself, if you need (check development notes bellow))

| NAME  | DESCRIPTION | OPTIONS (with default values) |
| ----- | ----------- | --------- |
| AutoLoad  | Apply new filter state without pressing submit (just change input value and new filter state will be applied) | `debounce`: 350 - debounce time of input change before request |
| InfinityScroll | Load new items while scrolling | `perPage`: 7 - size of bunch to load <br/> `total`: override native pagination total <br/> `scrollOffset`: 200 - scroll offset to bottom edge when request new page should be initialized |
| LoadMore | Load more button on the bottom of list to load new items to the list | `perPage`: 7 - size of bunch to load <br/> `total`: override native pagination total <br/> loadMoreSelector`: '[data-role="search-load-more"]' - selector to load more control (like a button) <br/> `loadMoreEvent`: 'click' - lib will be watching to this event and when it will be triggered on load more control new page request will be initialzed |
| Masonry | Integration with Masonry plugin | `masonry`: {itemSelector: '.grid-item'} - this options will be passed direct to masonry plugin |
| Packery | Integration with Packery plugin | `packery`: {transitionDuration: 0} - this options will be passed direct to packery plugin |
| SelectPicker | Integration with SelectPicker plugin | `selector`: 'selector' - selector to select picker elements (plugin will initialize select picker on those elements) <br/> `picker`: {} - this options will be passed direct to SelectPicker plugin |
| Wow | Integration with WOW plugin | `wow`: {} - this options will be passed direct to WOW plugin <br/> `lib`: typeof WOW !== 'undefined' ? WOW : null - instance of lib to work with  |
| WpRest | Integration with WP REST api | `totalHeader`: 'X-WP-Total' - header name of total items from WP response  <br/> `embed`: true - add embedded subitems (categories, image links, etc)|
| Separator | Add custom separator after some amount of posts (Featured posts can be implemented whith this plugin) | `after`: 6 - show separator after such amount of posts (if there are less posts, it will be shown after available amount of posts) <br/> `showIfNoPostsFound`: true - show separator if there are no posts at all (it will be shown after `placeholder`) <br/> `content`: '' - html content of placeholder (it has much priority then `el`) <br/> `el`: null - selector to element containing separator (inner html of this element will be shown like separator)|

## Options

Please check the demo projects to get know how can options be used.

| NAME  | DESCRIPTION | NEED TO BE PROVIDED (if different from default) | DEFAULT | COMMENT
| ----- | ----------- | --------- | --------- | --------- |
| `elements.filter`  | CSS selector for all inputs used for filtering  | ✓ |` [data-role="search-filter"]` |
| `elements.sort`  | CSS selector for all inputs used for sorting  | ✓ |  `[data-role="search-sort"]` |
| `elements.page`  | CSS selector for all inputs used pagination page select | ✓ |  `[data-role="search-fpage"]` |
| `elements.perPage`  | CSS selector for all inputs used for pagination items per page select  | ✓ |  `[data-role="search-perPage"]` |
| `elements.submit`  | CSS selector for all buttons used for submit action  | ✓ |  `[data-role="search-"submit]` |
| `elements.listUnProcessed`  | CSS selector for list container  | ✓ |  `jc-filter-list` |
| `elements.list`  | CSS selector for list container after vue was applied  | ✓ |  ` [data-role="search-result"]`|
| `jquery`  | If you use jQuery for your project just pass it to have same istance for lib and your app  | ✗ | 
| `templates.list`  | Vue template for listing | ✗ | 
| `templates.item`  | Vue template for list item | ✓ | 
| `templates.wrapper`  | Vue template for list wrapper | ✗ | 
| `templates.placeholder`  | Vue template for placeholder wrapper | ✗ | 
| `initialItems`  | Preloaded list of items  | ✗ |  `[]` |
| `initialControlsState`  | Initial state for controls (filters, sorting, pagination)  | ✗ | 
| `initialLoad`  | Should `loadControlsState` be called during first load | ✗ |  `true` |
| `loadingClass`  | Class of wrappper when new items are loaded  | ✗ |  `loading` |
| `url`  | Request url for items  | ✓ |  `location.protocol + '//' + location.host + location.pathname`  | by default reqsonpse should be in format `{total: <number total items count>, items: [<item object>]}`

## Development

Run demo frontend:
```sh
npm run dev; # then you can navigation to http://localhost:8080/demo/frontend/<demo name>, for example to http://localhost:8080/demo/frontend/simple
```

Run demo backend:
```sh
cd demo/backend && npm start;
```

Build lib:
```sh
npm run build
```

### Plugin

If you want to create your own plugin you need to check existed plugin realization, docs are comming soon ...
