let currentRequestId = 1;

export const loadData = (url, state, options, cb) => {
  const requestId = ++currentRequestId;

  // TODO reject previous request because of new is applied
  options.requestData(url, (data, status, xhr) => {
    if (requestId !== currentRequestId) {
      return; // no need to call callback because of new request was applied, TODO this will make a problems if transport will be used not only for endpoint list request
    }

    const normalizedData = options.parseResponse(data, status, xhr, state);

    options.afterServerResponseCb(normalizedData);

    cb(normalizedData.items);
  });
};