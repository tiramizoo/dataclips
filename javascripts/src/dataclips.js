import { saveAs } from "file-saver";

ExcelBuilder = require("excel-builder-webpack");

const { Workbook, Builder } = ExcelBuilder;

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
          filters[filterName] = {};
          Object.keys(customOptions.filters[filterName]).forEach((key) => {
            filters[filterName][key] = {
              value: customOptions.filters[filterName][key],
            };
          });
        });
      }
    }

    this.schema = schema;
    this.container = document.getElementById(config.dom_id);
    this.identifier = config.identifier;
    this.per_page = config.per_page;
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
    const processBatch = (result) => {
      const { data, currentPage, totalCount, totalPages } = result;

      if (currentPage < totalPages) {
        fetchDataInBatches(currentPage + 1, url, schema).then(processBatch);
      }

      reactable.addData(result.data, totalCount);
    };

    fetchDataInBatches(1, url, schema).then(processBatch);
  }

  fetchDataInBatches(page = 1, url, schema) {
    const ISO8601 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

    return fetch(url + "?page=" + page)
      .then(function (response) {
        return response.json();
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
      });
  }

  downloadCSV(data, schema, filename, disableSeconds) {
    if (data === null || !data.length) {
      return null;
    }

    const withoutSecondsDurationFormatter = disableSeconds ? "hh:mm" : "hh:mm:ss";
    const withoutSecondsDatetimeFormatter = disableSeconds ? "yyyy-MM-dd HH:mm" : "yyyy-MM-dd HH:mm:ss";
    const decimalSeparator = new Intl.NumberFormat()
      .formatToParts(1.1)
      .find((part) => part.type === "decimal").value;
    const columnDelimiter = decimalSeparator === "." ? "," : ";";

    let lines = [];

    const headerRow = Object.values(schema)
      .map((value) => `"${value.label}"`)
      .join(columnDelimiter);

    lines.push(headerRow);

    data.forEach((item) => {
      const row = Object.keys(schema)
        .map((key) => {
          const value = item[key];
          if (value !== null) {
            const type = schema[key].type;

            switch (type) {
              case "number":
                return new Intl.NumberFormat().format(value);
              case "date":
                return value;
              case "datetime":
                return value.toFormat(withoutSecondsDatetimeFormatter);
              case "time":
              case "duration":
                return value.toFormat(withoutSecondsDurationFormatter);
              case "boolean":
                return value.toString().toUpperCase();
              default:
                return value;
            }
          } else {
            return null;
          }
        })
        .map((fieldValue) => {
          if (fieldValue !== null) {
            return `"${fieldValue}"`;
          } else {
            return null;
          }
        })
        .join(columnDelimiter);

      lines.push(row);
    });

    const result = lines.join("\n");

    return new Promise((resolve, reject) => {
      var blob = new Blob([result], { type: "text/csv;charset=utf-8" });
      saveAs(blob, filename);
      resolve();
    });
  }

  init(fn) {
    const {
      container,
      name,
      schema,
      identifier,
      per_page,
      limit,
      time_zone,
      url,
      fetchDataInBatches,
      downloadCSV,
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
      defaultSearchPreset: default_filter,
      itemsChange: (items) => {
        this.onChange(items);
      },
      disableSeconds: disable_seconds,
      selectable: selectable,
      controls: {
        csv: {
          onClick: (e) => {
            e.stopPropagation();

            const button = e.target;
            const suggestedFilename = `${name}.csv`;

            const filename = prompt("filename", suggestedFilename);

            if (filename !== null) {
              button.disabled = true;
              const data = reactable.getFilteredData();
              downloadCSV(data, reactable.getFilteredSchema(), filename, reactable.config.disableSeconds).then(
                () => {
                  button.disabled = false;
                }
              );
            }
          },
          className: "r-icon-doc-text",
          key: "csv",
          label: "CSV",
        },
        refresh: {
          onClick: (e) => {
            e.stopPropagation();
            reactable.clearData();
            fetch.apply(this);
          },
          className: "r-icon-arrows-cw",
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
