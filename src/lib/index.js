import ListFactory from './components/ListFactory';
import * as transport from './api/transport';

class Behaviour {
  reload(options, appData, state = null) {
    appData.loading = true;

    if (!state) {
      state = options.getControlsState();
    }

    options.beforeReloadItemsCb(state);

    options.saveControlsState(state);

    this.lastRequestedState = state;

    transport.loadData(
      options.getRequestUrl(state),
      appData,
      options,
      (items) => {
        appData.items = items;

        options.vue.nextTick(() => {
          options.afterItemsDrawCb(items);
        });

        appData.loading = false;
      });
  }

  constructor(options, appData) {
    this.lastRequestedState = {
      filter: {},
      sort: {},
      pagination: {}
    };

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
      this.reload(options, appData, state);
    }, () => this.lastRequestedState);

    if (options.initialLoad && !appData.items.length) {
      this.reload(options, appData);
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
}