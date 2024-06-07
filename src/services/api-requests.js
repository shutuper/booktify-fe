import axios from "axios";
import localforage from "localforage";
import { toast } from "react-toastify";
import { ENV } from "../config/env.js";
import queryString from "query-string";
import { ApiError } from "./error-handler.js";

export class RequestService {
  axiosInstance = axios.create({
    baseURL: ENV.VITE_API_BASE_URL,
    paramsSerializer: (params) => queryString.stringify(params),
  });

  pendingRequests = [];
  addRequest(request) {
    this.pendingRequests.push(request);
  }

  onNewAccessToken(access_token) {
    this.pendingRequests = this.pendingRequests.filter((request) => {
      request(access_token);
      return false;
    });
  }

  countOfPendingRequests = 0;
  isAlreadyFetchingAccessToken = false;
  isNoConnectionToastActive = false;
  hasNewToken = false;

  async onInvalidRefreshToken() {
    await localforage.removeItem("accessToken");
    await localforage.removeItem("refreshToken");
  }

  constructor() {
    this.axiosInstance.interceptors.request.use(
      async (req) => {
        this.countOfPendingRequests++;
        const token = await localforage.getItem("accessToken");

        if (token && (!req.headers["Authorization"] || this.hasNewToken)) {
          req.headers["Authorization"] = `Bearer ${token}`;
          if (this.hasNewToken) {
            this.hasNewToken = false;
          }
        }

        return req;
      },
      (err) => {
        Promise.reject(err);
      },
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.countOfPendingRequests--;
        return response;
      },
      async (error) => {
        const { config, response } = error;
        if (!response) {
          if (!this.isNoConnectionToastActive) {
            this.isNoConnectionToastActive = true;
            toast.error("No connection with the server.", {
              onClose: () => {
                this.isNoConnectionToastActive = false;
              },
            });
          }

          return Promise.reject(new ApiError());
        }

        const responseData =
          response?.data instanceof Blob &&
          response?.data.type === "application/json"
            ? await response?.data?.text()
            : response?.data || {};
        const responseJson =
          typeof responseData === "string"
            ? JSON.parse(responseData)
            : responseData;

        const { status } = response;
        const originalRequest = config;
        this.countOfPendingRequests--;

        const oldRefreshToken = await localforage.getItem("refreshToken");

        if (status === 400) {
          if (!config.ignoreErrorMessages) {
            toast.error(responseJson.message || "Api error");
          }
          return Promise.reject(new ApiError(responseJson));
        }

        if (status === 401 && !oldRefreshToken) {
          await this.onInvalidRefreshToken();
          return Promise.reject();
        }

        if (status === 401 && oldRefreshToken) {
          if (
            this.isAlreadyFetchingAccessToken &&
            config.url === "/public/users/refresh-token"
          ) {
            await this.onInvalidRefreshToken();
            return Promise.reject();
          }

          if (
            !this.isAlreadyFetchingAccessToken &&
            this.countOfPendingRequests === 0
          ) {
            this.isAlreadyFetchingAccessToken = true;

            try {
              const {
                data: { accessToken: accessToken, refreshToken: refreshToken },
              } = await this.axiosInstance({
                url: `/public/users/refresh-token`,
                baseURL: ENV.VITE_API_BASE_URL,
                method: "POST",
                data: {
                  refreshToken: oldRefreshToken,
                },
              });

              this.hasNewToken = true;
              await localforage.setItem("accessToken", accessToken);
              await localforage.setItem("refreshToken", refreshToken);

              this.isAlreadyFetchingAccessToken = false;

              this.onNewAccessToken(accessToken);

              return this.axiosInstance(originalRequest);
            } catch (error) {
              this.isAlreadyFetchingAccessToken = false;
              await this.onInvalidRefreshToken();
              return Promise.reject();
            }
          }

          return new Promise((resolve) => {
            this.addRequest((access_token) => {
              originalRequest.headers.Authorization = `bearer ${access_token}`;
              resolve(this.axiosInstance(originalRequest));
            });
          });
        }

        if (status === 403) {
          const err = new ApiError(responseJson);
          if (!config.ignoreErrorMessages) {
            toast.error(err.message || "Action forbidden");
          }
          return Promise.reject(err);
        }

        const params = config.params;
        const err = new ApiError(responseJson);

        if (!params?.silent) {
          if (!config.ignoreErrorMessages) {
            toast.error(err.message || "Unknown server error");
          }
        }
        return Promise.reject(err);
      },
    );
  }

  get(url, config) {
    return this.axiosInstance.get(url, config);
  }

  post(url, data, config) {
    return this.axiosInstance.post(url, data, config);
  }

  patch(url, data, config) {
    return this.axiosInstance.patch(url, data, config);
  }

  put(url, data, config) {
    return this.axiosInstance.put(url, data, config);
  }

  delete(url, config) {
    return this.axiosInstance.delete(url, config);
  }
}

export const ApiRequestService = new RequestService();
