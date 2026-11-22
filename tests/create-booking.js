
import http from "k6/http";
import { check } from "k6";

export const options = {
  scenarios: {
    simultaneousBookings: {
      executor: "per-vu-iterations",
      vus: 50,
      iterations: 1,
      maxDuration: "60s",
    },
  },
};

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc2YTE2MmJkLTNhNjctNDZiNS1iNmVkLWJiMWQ2NzI1ZWZjZCIsImlhdCI6MTc5NTM0NDE3NSwiZXhwIjoxNzk1MzQ3Nzc1fQ.4BtLF_pdQNg8wBRKE7maFNFbextsrMAAau8tJkjdmJI"

const BASE_URL="http://localhost:3000"
// const EVENT_ID="745c4dc5-9078-4c50-b91d-51bbb014ab0b"
const EVENT_ID="d6277e27-3587-45c3-a095-e1171cffd446"

export default function () {
  const payload = JSON.stringify({
    totalBoughtTickets: 1,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  };

  const response = http.post(
    `${BASE_URL}/api/v1/bookings/${EVENT_ID}`,
    payload,
    params
  );

  console.log("STATUS:", response.status);
  console.log("BODY:", response.body);

  check(response, {
    "booking created": (r) => r.status === 201,
  });
}
