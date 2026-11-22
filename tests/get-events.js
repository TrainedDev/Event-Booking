
import http from "k6/http";
import { check } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 10 },
    { duration: "10s", target: 25 },
    { duration: "10s", target: 50 },
    { duration: "10s", target: 100 },
  ],
};

export default function () {
  const response = http.get(
    "http://localhost:3000/api/v1/events"
  );

  check(response, {
    "status is 200": (r) => r.status === 200,
  });
}
