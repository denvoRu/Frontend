import axios from 'axios';
import { getTokenFromCookie, removeTokensFromCookies, setTokensToCookies } from './token';
import { LoginResponse } from '../types/auth';


const BACKEND_URL = 'http://localhost:5000/'

export const PagesURl = {
  AUTH: 'auth',
  USER: 'user',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  INSTITUTE: 'institute',
  MODULE: 'module',
  SUBJECT: 'subject',
  LESSON: 'lesson',
  FORM: 'form',
  SCHEDULE: 'schedule',
}

const REQUEST_TIMEOUT = 10000;


const instance = axios.create({
  baseURL: BACKEND_URL,
  timeout: REQUEST_TIMEOUT
});


async function refreshAccessToken() {
  try {
    const refreshToken = getTokenFromCookie('refresh');
    const response = await axios.post<LoginResponse>(BACKEND_URL + PagesURl.AUTH + '/token', {},{
      params: {
        "refresh_token": refreshToken,
      }
    });
    setTokensToCookies(response.data.access_token, 'access');
    setTokensToCookies(response.data.refresh_token, 'refresh');
    return response.data.access_token;
  } catch {
    removeTokensFromCookies('access');
    removeTokensFromCookies('refresh');
    window.location.href = '/login';
  }
}


instance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      try {
        const newAccessToken = await refreshAccessToken();
        const originalRequestConfig = error.config;
        originalRequestConfig.headers['Authorization'] = 'Bearer ' + newAccessToken;
        
        return axios(originalRequestConfig);
      } catch {
        removeTokensFromCookies('access');
        removeTokensFromCookies('refresh');
        window.location.href = '/login';
      }
    }

    if (error.message === `timeout of ${REQUEST_TIMEOUT}ms exceeded`) {
      console.log(error);
    } else {
      switch (error.response?.status) {
        case 404:
          console.log(error);
          break;
        case 403:
          window.location.href = '/';
          break;
        case 400:
          break;
        default:
          console.log(error);
          if (error.code === 'ECONNABORTED') {
            window.location.href = 'error';
          }
      }
    }

    return Promise.reject(error);
  }
);

instance.interceptors.request.use(
  config => {
    config.timeout = REQUEST_TIMEOUT;
    config.headers.Authorization = 'Bearer ' + getTokenFromCookie('access');
    if (config.url){
      {
        config.params = {
          ...config.params,
        }
      }
    }
    //console.log(config)
    return config;
  },
/*   error => Promise.reject(error) */
);

export default instance;