module.exports = function plugin() {
  return {
    id: 'maximo-api-filter',
    decorators: {
      oas3: {
        'filter-mxapi-paths': () => {
          const include = /^\/os\/mxapi(sr|asset)/;
          return {
            PathItem: {
              leave(pathItem, { key, parent }) {
                if (typeof key === 'string' && (!include.test(key))) {
                  delete parent[key];
                }
              }
            }
          };
        }
      }
    }
  };
};