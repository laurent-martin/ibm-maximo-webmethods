module.exports = function plugin() {
  return {
    id: 'maximo-api-filter',
    decorators: {
      oas3: {
        'filter-mxapi-paths': () => {
          //const include_regex = /./; // /^\/os\/mxapi(sr|asset)/;
          const include_regex = /mxapi/;
          const exclude_regex = /class|mxapiah/;
          return {
            PathItem: {
              leave(pathItem, { key, parent }) {
                if (typeof key === 'string' && (!include_regex.test(key) || exclude_regex.test(key))) {
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