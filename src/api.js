import axios from 'axios';
import { createHash } from 'crypto';

export const fetchNews = (limit = 15) => axios({
  baseURL: 'https://api.tgt72.ru',
  url: '/api/v5/news',
  method: 'GET',
  params: {
    limit,
  },
});

export const fetchCard = (cardId) => {
  const date = (new Date())
    .toLocaleDateString('en-GB')
    .replace(/\//g, '.');

  const hash = createHash('md5')
    .update(`${date}.${cardId}`)
    .digest('hex');

  const options = {
    baseURL: 'https://api.tgt72.ru',
    url: '/api/v5/balance',
    method: 'GET',
    params: {
      card: cardId,
      hash,
    },
  };

  return axios(options);
};
