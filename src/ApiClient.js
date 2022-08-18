import { ACCESS_TOKEN_STORAGE_KEY } from "./constants";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export default class ApiClient {
  constructor(onError) {
    this.baseUrl = BASE_API_URL + "/api";
    this.onError = onError;
  }

  async request(options) {
    let response = await this._request(options);
    if (response.status === 401 && options.url !== "/tokens") {
      const refreshResponse = await this.put("/tokens", {
        access_token: localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY),
      });
      if (refreshResponse.ok) {
        localStorage.setItem(
          ACCESS_TOKEN_STORAGE_KEY,
          refreshResponse.body.access_token
        );
        response = await this._request(options);
      }
    }
    if (response.status >= 500 && this.onError) {
      this.onError(response);
    }
    return response;
  }
  async _request(options) {
    let query = new URLSearchParams(options.query || {}).toString();
    if (query !== "") {
      query = "?" + query;
    }

    let response;
    try {
      response = await fetch(this.baseUrl + options.url + query, {
        method: options.method,
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY),
          ...options.headers,
        },
        credentials: options.url === "/tokens" ? "include" : "omit",
        body: options.body ? JSON.stringify(options.body) : null,
      });
    } catch (error) {
      response = {
        ok: false,
        status: 500,
        json: async () => {
          return {
            code: 500,
            message: "The server is unresponsive",
            description: error.toString(),
          };
        },
      };
    }

    return {
      ok: response.ok,
      status: response.status,
      body: response.status !== 204 ? await response.json() : null,
    };
  }

  async get(url, query, options) {
    return this.request({ method: "GET", url, query, ...options });
  }

  async post(url, body, options) {
    return this.request({ method: "POST", url, body, ...options });
  }

  async put(url, body, options) {
    return this.request({ method: "PUT", url, body, ...options });
  }

  async delete(url, options) {
    return this.request({ method: "DELETE", url, ...options });
  }

  async login(username, password) {
    const response = await this.post("/tokens", null, {
      headers: { Authorization: "Basic " + btoa(username + ":" + password) },
    });
    if (response.ok) {
      const accessToken = response.body.access_token;
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
    }
    return response;
  }

  async logout() {
    // TODO: delete refresh token from cookies as well
    await this.delete("/tokens");
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  }
}
