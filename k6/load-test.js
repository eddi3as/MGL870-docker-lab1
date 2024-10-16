import http from 'k6/http';
import { sleep, check } from 'k6';

export const BASE_URL = 'http://localhost:4000/api/v1';

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.02'], // http errors should be less than 1%
    http_req_duration: ['p(95)<250'], // 95% of requests should be below 250ms
  },
  stages: [
    { duration: '30s', target: 10 },   // simulate ramp-up of traffic from 1 to 20 users over 30 seconds.
    { duration: '30s', target: 100 },   // simulate ramp-up of traffic from 1 to 20 users over 30 seconds.
    { duration: '20s', target: 0 },    // ramp-down to 0 users
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
  check(responses, {
    'status is 500': (r) => r.status == 500,
  });

  sleep(1);
}

