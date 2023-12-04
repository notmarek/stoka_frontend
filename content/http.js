import { token } from "./api.js";
import { ENDPOINT } from "./consts.js";
import { log } from "./main.js";
const proxy_handler = {
  get(target, prop, _receiver) {
    return async (...args) => {
      const res = await target;
      log("http.proxy", `${prop}, ${target}`);
      return await res[prop].apply(res, args);
    };
  },
};
export const http = {
  _fetch: (path, method, options) => {
    let headers = options.noauth ? {} : { Authorization: token() };
    let fetch_options = { method: method };
    if (options.hasOwnProperty("json")) {
      fetch_options.body = JSON.stringify(options.json);
      headers["Content-Type"] = "application/json";
    }
    fetch_options.headers = { ...fetch_options.headers, ...headers };
    fetch_options = { ...fetch_options, ...options };
    log("http", JSON.stringify(fetch_options));
    return new Proxy(
      fetch(`${ENDPOINT}/${path}`, fetch_options),
      proxy_handler
    );
    // return new Proxy(fetch(path, fetch_options), proxy_handler);
  },
  get(path, options = {}) {
    return this._fetch(path, "get", options);
  },
  post(path, options = {}) {
    return this._fetch(path, "post", options);
  },
  delete(path, options = {}) {
    return this._fetch(path, "delete", options);
  },
  put(path, options = {}) {
    return this._fetch(path, "put", options);
  },
};
