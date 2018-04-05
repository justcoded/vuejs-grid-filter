import assign from 'lodash.assign';
import toPairs from 'lodash/toPairs';

const DEFAULT_OPTIONS = {
  totalHeader: 'X-WP-Total',
  embed: true
};

export default (params = {}) => {
  const options = assign({}, DEFAULT_OPTIONS, params);

  return {
    parseResponse: function (response, status, xhr) {
      return {
        total: xhr.getResponseHeader(options.totalHeader),
        items: response
      };
    },
    getRequestUrl: function (state) {
      const getUrlSearchPair = (data) => {
        const name = data[0];
        let value = data[1];

        if (Array.isArray(value)) {
          value = value.join(',');
        }

        if (!value) {
          return null;
        }

        const normalizedName = name;
        const normalizedValue = encodeURIComponent(value);

        return normalizedName + '=' + normalizedValue;
      };

      const orderBy = state.sort
        ? Object.keys(state.sort)[0]
        : null;

      const order = orderBy
        ? state.sort[orderBy]
        : null;

      return this.url + '?' +
        [
          options.embed ? '_embed' : false,
          toPairs(state.filter).map((f) => getUrlSearchPair(f)).filter((f) => f).join('&'),
          orderBy ? getUrlSearchPair(['orderby', orderBy]) : null,
          orderBy ? getUrlSearchPair(['order', order]) : null,
          getUrlSearchPair(['page', state.pagination.page]),
          getUrlSearchPair(['per_page', state.pagination.perPage])
        ].filter((p) => p).join('&');
    }
  }
}