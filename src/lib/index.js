import ListFactory from './components/ListFactory';
import * as transport from './api/transport';

class Behaviour {
  reload(state = null) {
    if (!state) {
      state = this.options.getControlsState();
    }

    this.setState(state)
  }

  setState(state = null) {
    this.options.beforeReloadItemsCb(state, this.lastRequestedState);

    this.options.saveControlsState(state);

    this.lastRequestedState = state;

    this.appData.loading = true;

    transport.loadData(
      this.options.getRequestUrl(state),
      this.appData,
      state,
      this.options,
      (items) => {
        this.appData.items = items;

        this.options.vue.nextTick(() => {
          this.options.afterItemsDrawCb(items);
        });

        this.appData.loading = false;
      });
  }

  constructor(options, appData) {
    this.lastRequestedState = {
      filter: {},
      sort: {},
      pagination: {}
    };

    this.appData = appData;
    this.options = options;

    options.beforeInitCb(appData);

    const controlsStateData = options.loadControlsState();

    if (controlsStateData) {
      options.drawControlsState(controlsStateData);

      this.lastRequestedState = {
        ...this.lastRequestedState,
        ...controlsStateData
      }
    }

    options.registerItemsUpdater((state) => {
      this.reload(state);
    }, () => this.lastRequestedState);

    if (options.initialLoad && !appData.items.length) {
      this.reload();
    }
  }
}

export default (options) => {
  const data = {
    loading: false,
    items: options.initialItems || [],
    options
  };

  const behaviour = new Behaviour(options, data);

  options.vue.use({
    install(Vue) {
      Vue.component(options.elements.listUnProcessed, {
        template: options.templates.wrapper,
        data: () => data,
        components: {
          'list': ListFactory(options)
        }
      })
    }
  });

  return behaviour;
}