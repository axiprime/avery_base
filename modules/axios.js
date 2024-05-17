import axios from 'axios'

const axiosErrorCustom = axios.create();
axiosErrorCustom.interceptors.response.use(
    response => {
        return {
            FROM: 'response',
            status: response.status,
            data: response.data
        };
    },
    error => {
        if (error.response) {
            const err = {
                FROM: 'ResponseError',
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                headers: error.response.headers,
                config: {
                    url: error.config.url,
                    method: error.config.method,
                    headers: error.config.headers,
                    params: error.config.params,
                    data: error.config.data
                },
                request: {
                    method: error.request.method,
                    path: error.request.path,
                    status: error.request.res.statusCode,
                    statusText: error.request.res.statusText,
                    url: error.request.res.responseUrl
                },
            };
            return Promise.reject(err);
        } else if (error.request) {
            return Promise.reject({
                status: 500,
                FROM: 'requestError',
                code: error.code,
                errno: error.errno,
                message: error.message
            });
        } else {
            return Promise.reject({
                status: 500,
                FROM: 'unknownError',
                message: error.message
            });
        }
    }
);

export default axiosErrorCustom;