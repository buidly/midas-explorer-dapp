import * as React from 'react';
import axios from 'axios';
import { analytics } from 'helpers';
import { useGlobalState } from 'context';

const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
  const timeoutRef = React.useRef<any>();
  const {
    activeNetwork: { accessToken, apiUrl },
  } = useGlobalState();
  const [interceptorsReady, setInterceptorsReady] = React.useState(false);
  const [requestId, setRequestId] = React.useState(-1);
  const [responseId, setResponseId] = React.useState(-1);
  const [token, setToken] = React.useState('');
  const explorerVersion = process.env.REACT_APP_CACHE_BUST;
  const ignoreList: string[] = [];

  const setResponseInterceptors = () => {
    const newResponseId = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const reqUrl = error.config.url;
        const logError = reqUrl && !ignoreList.some((url) => reqUrl.indexOf(url) > -1);

        if (explorerVersion !== undefined && logError) {
          analytics.sendEvent({ action: 'failed-request', label: reqUrl, explorerVersion });
        }

        return Promise.reject(error);
      }
    );
    setResponseId(newResponseId);
  };

  const setInterceptors = (newToken: string) => {
    const newRequestId = axios.interceptors.request.use(
      async (config) => {
        config.headers = {
          'x-access': `${newToken}`,
        };
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );
    setRequestId(newRequestId);
    setResponseInterceptors();
  };

  const fetchToken = () => {
    const instance = axios.create();
    instance
      .post(`${apiUrl}/access`, '')
      .then((response) => {
        const newToken = response.headers['x-access'];
        setToken(newToken);
        setInterceptors(newToken);
        setInterceptorsReady(true);
      })
      .catch((err) => {
        console.error(err);
        setInterceptorsReady(true);
      });
  };

  const configureAxios = () => {
    if (accessToken) {
      if (!token) {
        fetchToken();
      } else {
        const timestamp = token.split('-').pop();
        const tokenTimestamp = timestamp ? parseInt(timestamp) : 0;
        const now = Math.floor(Date.now() / 1000);
        const fetchNextTokenSec = tokenTimestamp - now - 60;
        timeoutRef.current = setTimeout(() => {
          axios.interceptors.request.eject(requestId);
          axios.interceptors.request.eject(responseId);
          fetchToken();
        }, fetchNextTokenSec * 1000);
      }
    } else {
      setResponseInterceptors();
      setInterceptorsReady(true);
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  };

  React.useEffect(configureAxios, [token]);
  return interceptorsReady ? <>{children}</> : null;
};

export default AxiosInterceptor;