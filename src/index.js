import init from './lib';
import merge from 'lodash/merge';
import toPairs from 'lodash/toPairs';
import queryString from 'qs';
import * as Plugins from './plugins';

class JustFilter {
  _prepareOptionElements(options) {
    const replaceSelectorWithElements = (selector, selectorFallback = false) => {
      if (typeof selector !== 'string') {
        return selector;
      }

      const elements = options.jquery(selector).toArray();

      if (!selectorFallback) {
        return elements;
      }

      return elements.length ? elements : selector;
    };

    options.elements.filter = replaceSelectorWithElements(options.elements.filter);
    options.elements.submit = replaceSelectorWithElements(options.elements.submit);
    options.elements.list = replaceSelectorWithElements(options.elements.list, true);

    return options;
  }

  constructor(params) {
    const options = merge({}, JustFilter.defaults, params);

    this._options = this._prepareOptionElements(options);
    this._lib = null;

    return this;
  }

  init() {
    this._lib = init(this._options);
  }

  mergeMethods(...objects) {
    const result = {};

    objects.forEach((obj) => {
      if (!obj) {
        return;
      }

      for (let prop in obj) {
        if (!obj.hasOwnProperty(prop)) {
          continue;
        }

        if (!result[prop]) {
          result[prop] = obj[prop];
        } else {
          if (typeof result[prop] === 'function') {
            const oldMethod = result[prop];
            const newMethod = obj[prop];

            result[prop] = function () {
              const handler = newMethod.handler || newMethod;

              handler._context = {
                ...this,
                _super: oldMethod
              }; // parent method will be available by this._super

              const isBefore = newMethod.before;

              if (isBefore) {
                handler.apply(handler._context, arguments);

                return oldMethod.apply(oldMethod._context || this, arguments);
              } else {
                oldMethod.apply(oldMethod._context || this, arguments);

                return handler.apply(handler._context, arguments);
              }
            };
          } else if (typeof result[prop] === 'object') {
            result[prop] = this.mergeMethods(result[prop], obj[prop]);
          } else {
            result[prop] = obj[prop];
          }
        }
      }
    });

    return result;
  }

  use(plugin) {
    if (typeof plugin === 'function') {
      plugin = plugin(this._options);
    }

    this._options = this.mergeMethods(this._options, plugin);

    return this;
  }

  getState() {
    return this._lib.lastRequestedState;
  }

  setState(state) {
    return this._lib.setState({
      ...this.getState(),
      ...state,
    });
  }
}

JustFilter.defaults = {
  elements: {
    filter: '[data-role="search-filter"]',
    listUnProcessed: 'jc-filter-list',
    list: '[data-role="search-result"]',
    submit: '[data-role="search-submit"]'
  },
  jquery: null,
  vue: null,
  templates: {
    list: `
      <div class="filter-list-container-wrapper">
        <div class="filter-list-wrapper" data-role="search-result">
          <template v-if="items.length">
            <list-item v-for="(item, index) in items" :key="index" :item="item"></list-item>
          </template>
          <list-placeholder v-else></list-placeholder>
        </div>
      </div>
    `,
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
    `,
    wrapper: `
        <list :class="loading && options.loadingClass" :items="items" :placeholder="options.noItemsPlaceholder"></list>
    `,
    placeholder: '<span class="empty-result">No items was found ...</span>'
  },
  initialItems: [],
  initialControlsState: null, // url rewrites can be realized via custom state provided during initialization
  initialLoad: true,
  loadingClass: 'loading',
  url: location.protocol + '//' + location.host + location.pathname,
  getControlsState: function () {
    const filterState = this.elements.filter.reduce((controlsState, el) => {
      const input = this.jquery(el);
      const isCheckbox = input.is('input[type="checkbox"]');
      const isRadio = input.is('input[type="radio"]');
      const name = input.prop('name');
      let value = null;

      if (isCheckbox) {
        value = input.is(':checked') ? [controlsState[name], input.val()].filter((val) => val).join(',') : controlsState[name]
      } else if (isRadio) {
        value = input.is(':checked') ? input.val() : controlsState[name]
      } else {
        value = input.val();
      }

      return {...controlsState, [input.prop('name')]: value}
    }, {});

    return {
      filter: filterState,
      sort: {},
      pagination: {},
    }
  },
  registerItemsUpdater: function (update) {
    if (this.elements.submit && this.elements.submit[0]) {
      this.jquery(this.elements.submit[0]).on('click', () => update());
    }
  },
  getRequestUrl: function (state) {
    const getUrlSearchPair = (data, type = null) => {
      const name = data[0];
      let value = data[1];

      if (Array.isArray(value)) {
        value = value.join(',');
      }

      if (!value) {
        return null;
      }

      const normalizedName = encodeURIComponent(name);
      const normalizedValue = encodeURIComponent(value);

      return type
        ? type + '[' + normalizedName + ']'  + '=' + normalizedValue
        : normalizedName + '=' + normalizedValue;
    };

    return this.url + '?'
      +
      [
        toPairs(state.filter).map((f) => getUrlSearchPair(f, 'filter')).filter((f) => f).join('&'),
        toPairs(state.sort).map((f) => getUrlSearchPair(f, 'sort')).filter((s) => s).join('&'),
        getUrlSearchPair(['current_page', state.pagination.page]),
        getUrlSearchPair(['per_page', state.pagination.perPage])
      ].filter((p) => p).join('&');
  },
  requestData: function (url, cb) {
    this.jquery.getJSON(url, cb);
  },
  loadControlsState: function () { // load controls state (load by priority from initialControlsState, url data)
    if (this.initialControlsState) {
      return this.initialControlsState;
    }

    const normalizeValues = (data) => {
      const isArrayValue = (val) => !Array.isArray(val) && /,/.test(val);

      for (let key in data) {
        if (isArrayValue(data[key])) {
          data[key] = data[key].split(',');
        }
      }

      return data;
    };

    return this.deserializeUrlToState(queryString, normalizeValues);
  },
  deserializeUrlToState: function (queryLib, normalizeValues) {
    const query = queryLib.parse(location.search.replace(/^\?/, ''));

    return {
      filter: normalizeValues(query.filter) || {},
      sort: normalizeValues(query.sort) || {},
      pagination: {
        page: parseInt(query['current_page']) || null,
        perPage: parseInt(query['per_page']) || null
      }
    }
  },
  saveControlsState: function (state, updateStateHook = null) {
    const normalizeValues = (state) => {
      const normalizedState = {};

      for (let key in state) {
        if (state[key]) {
          normalizedState[key] = state[key];
        }
      }

      return normalizedState;
    };

    const normalizedState = {
      filter: normalizeValues(state.filter),
      sort: normalizeValues(state.sort),
      ...((() => {
        const paginationState = {};

        if (state.pagination.page) {
          paginationState['current_page'] = state.pagination.page;
        }

        if (state.pagination.perPage) {
          paginationState['per_page'] = state.pagination.perPage;
        }

        return paginationState;
      })())
    };

    if (updateStateHook) {
      updateStateHook(normalizedState);
    }

    if (window.history.replaceState) {
      window.history.replaceState(normalizedState, '', this.serializeStateToUrl(normalizedState, queryString));
    }
  },
  serializeStateToUrl: function (state, queryLib) {
    const search = queryLib.stringify(state);

    return location.protocol + '//' + location.host + location.pathname
      + (search ? ('?' + search) : '');
  },
  applyControlValue: function (input, value) {
    const $input = $(input);

    const isCheckbox = $input.is('input[type="checkbox"]');
    const isRadio = $input.is('input[type="radio"]');

    if (isCheckbox) {
      value = Array.isArray(value) ? value : [value];
    }

    if (isRadio) {
      if ($input.val() === value) {
        $input.prop('checked', true).trigger('change');
      }

      return;
    }

    this.jquery(input).val(value).trigger('change').find('option:selected').attr('selected', '');
  },
  drawControlsState: function (controlsState) {
    if (!controlsState) {
      return;
    }

    const drawFilterState = () => {
      const state = controlsState.filter;

      for (let key in state) {
        const value = state[key];
        const inputs = this.elements.filter.filter((el) => el.name === key);

        inputs.forEach((input) => {
          this.applyControlValue(input, value);
        });
      }
    };

    drawFilterState();
  },
  getControlInputs: function () {
    return this.elements.filter;
  },
  parseResponse: function (data, status, xhr) {
    return data;
  },
  beforeInitCb: function () {
    // NOP
  },
  afterServerResponseCb: function (data, state) {
    // NOP
  },
  afterItemsDrawCb: function (items) {
    // NOP
  },
  beforeReloadItemsCb: function (newState, prevState) {
    // NOP
  },
};

if (typeof window !== 'undefined') {
  window.JustFilter = JustFilter;
  window.JustFilter.Plugins = Plugins;
}

export default JustFilter;
export {Plugins};
