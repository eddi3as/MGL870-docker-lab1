import http from 'k6/http';
import { sleep, check } from 'k6';

export const BASE_URL = 'http://localhost:4000/api/v1';

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // below normal load
    { duration: '30s', target: 50 },
    { duration: '30s', target: 100 }, // around the breaking point
    { duration: '30s', target: 250 },
    { duration: '30s', target: 500 }, // beyond the breaking point
    { duration: '30s', target: 700 },
    { duration: '30s', target: 0 }, // scale down. Recovery stage.
  ],
};

export default function () {
  const req1 = {
    method: 'GET',
    url: `${BASE_URL}/compteurs`,
  };
  const req2 = {
    method: 'GET',
    url: `${BASE_URL}/fontaines`,
  };
  const req3 = {
    method: 'GET',
    url: `${BASE_URL}/pointsdinteret`,
  };

  // call the 4 requests in parallel
  const responses = http.batch([req1, req2, req3]);

  sleep(1);
}