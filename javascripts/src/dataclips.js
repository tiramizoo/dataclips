export default class Dataclips {
  constructor(config, customFormatters, customOptions) {
    let schema = Object.assign({}, config.schema);

    if (Object.keys(customFormatters).length) {
      Object.keys(config.schema).forEach((key) => {
        const formatter = config.schema[key]["formatter"];
        if (formatter) {
          if (customFormatters.formatters[formatter]) {
            schema[key]["formatter"] = customFormatters.formatters[formatter];
          } else {
            delete schema[key]["formatter"];
          }
        }
      });
    }

    const filters = {};

    if (Object.keys(customOptions).length) {
      this.default_filter = customOptions.default_filter;
      this.rowActions = customOptions.rowActions;

      if (customOptions.filters) {
        Object.keys(customOptions.filters).forEach((filterName) => {
          filters[filterName] = customOptions.filters[filterName];
        });
      }
    }

    this.schema = schema;
    this.container = document.getElementById(config.dom_id);
    this.identifier = config.identifier;
    this.url = config.url;
    this.name = config.name;
    this.time_zone = config.time_zone;
    this.filters = filters;
    this.disable_seconds = config.disable_seconds;
    this.selectable = config.selectable;

    if (config.limit) {
      this.limit = config.limit;
    } else {
      const availableHeight = window.innerHeight - this.container.offsetTop;
      this.limit = Math.max(parseInt(availableHeight / 30) - 2, 20);
    }
  }

  onChange() {} // implement me

  refresh() {
    this.reactable.clearData();
    this.fetch();
  }

  getSelected() {
    return this.reactable.getSelectedData();
  }

  fetch() {
    const { url, schema, reactable, fetchDataInBatches } = this;

    const handleServiceUnavailableError = (e) => {
      if (e === "Service Unavailable" || e === "Internal Server Error") {
        if (confirm("We are experiencing issues with our data source. Would you like to try again?")) {
          this.refresh();
        }
      } else {
        throw e;
      }
    }

    const processBatch = (result) => {
      const { data, currentPage, totalCount, totalPages } = result;

      if (currentPage < totalPages) {
        fetchDataInBatches(currentPage + 1, url, schema).then(processBatch).catch(handleServiceUnavailableError);
      }

      reactable.addData(result.data, totalCount);
    };

    fetchDataInBatches(1, url, schema).then(processBatch).catch(handleServiceUnavailableError);
  }

  fetchDataInBatches(page = 1, url, schema) {
    const ISO8601 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

    return fetch(url + "?page=" + page)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(response.statusText);
        }
      })
      .then(function (data) {
        if (data.records.length) {
          const records = data.records.map(function (recordText) {
            const parsedRecord = JSON.parse(recordText);

            let record = {};

            Object.entries(schema).forEach(([schemaKey, options]) => {
              const recordValue = parsedRecord[schemaKey];
              if (recordValue !== undefined) {
                if (options.type === "datetime" && recordValue !== null) {
                  if (ISO8601.test(recordValue)) {
                    const matches = recordValue.match(ISO8601);
                    const tz = matches[2];
                    if (tz) {
                      record[schemaKey] = recordValue;
                    } else {
                      // console.warn(`Dataclips: attribute '${schemaKey}' has no TZ information, assuming UTC`)
                      record[schemaKey] = `${recordValue}Z`; // UTC
                    }
                  } else {
                    throw new TypeError(
                      `Dataclips: ensure attribute '${schemaKey}' is valid ISO8601.`
                    );
                  }
                } else {
                  record[schemaKey] = recordValue;
                }
              } else {
                throw new TypeError(
                  `Dataclips: attribute '${schemaKey}' is undefined. Please verify schema.`
                );
              }
            });
            return record;
          });

          return {
            data: records,
            currentPage: data.page,
            totalCount: data.total_count,
            totalPages: data.total_pages
          };
        } else {
          return {
            data: [],
            currentPage: page,
            totalCount: 0,
            totalPages: page,
          };
        }
      })
  }

  init(fn) {
    const {
      container,
      name,
      schema,
      identifier,
      limit,
      time_zone,
      filters,
      default_filter,
      rowActions,
      fetch,
      disable_seconds,
      selectable,
    } = this;

    const reactable = Reactable.init({
      container: container,
      schema: schema,
      identifier: identifier,
      limit: limit,
      searchPresets: filters,
      actions: rowActions,
      displayTimeZone: time_zone,
      itemsChange: (items) => {
        this.onChange(items);
      },
      disableSeconds: disable_seconds,
      selectable: selectable,
      fileName: name,
      locale: document.querySelector('html').getAttribute('lang') || Intl.NumberFormat().resolvedOptions().locale,
      controls: {
        refresh: {
          onClick: (e) => {
            e.stopPropagation();
            reactable.clearData();
            fetch.apply(this);
          },
          key: "refresh",
          label: "Refresh",
        },
      },
    });

    reactable.render();

    this.reactable = reactable;

    if (default_filter) {
      reactable.applySearchPreset(default_filter);
    }

    this.fetch();
    fn(this);
  }
}
