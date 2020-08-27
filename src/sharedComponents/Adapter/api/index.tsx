import axios from 'axios';
import { ProviderType } from './../functions';

const api: ProviderType = ({ elasticUrl, url, params, timeout }) =>
  axios({
    method: 'GET',
    baseURL: elasticUrl,
    url,
    params,
    timeout,
  });

export default api;
