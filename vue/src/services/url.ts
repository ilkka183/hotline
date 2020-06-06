import { apiLocalhostUrl, apiServerUrl } from '../config.json';

const localhost = true;

export const apiUrl = localhost ? apiLocalhostUrl : apiServerUrl;
