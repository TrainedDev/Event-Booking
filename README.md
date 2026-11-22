b# Event Booking API

A backend application for managing events and customer ticket bookings, with role-based access control, transactional ticket inventory management, and asynchronous email notifications.

**Repository:** https://github.com/TrainedDev/Event-Booking

## Quick Access

| Resource | Link / Details |
|---|---|
| GitHub repository | https://github.com/TrainedDev/Event-Booking |
| Events API | `GET /api/v1/events` |
| Create booking API | `POST /api/v1/bookings/:id` |
| Booking route | `/api/v1/bookings/:id` |
| Local server | `http://localhost:3000` |
| Load testing | `k6` |
| Background jobs | BullMQ + Redis |

> Replace or add deployed API URLs here if your final deployment is available. The local base URL above is the one used in the recorded local k6 test.

## Tech Stack

- Node.js and Express
- PostgreSQL
- Sequelize ORM
- JWT authentication and role-based authorization
- Redis and BullMQ for background jobs
- Nodemailer for email notifications
- k6 for load testing

## Main Features

- User authentication and role-based access for organizers and customers.
- Organizers can create and update events.
- Customers can browse events and book tickets.
- Ticket inventory is updated within a database transaction.
- Booking confirmation emails are queued for background processing.
- Event update notifications are queued for customers who booked the event.

## Booking Concurrency and Data Consistency

The booking service uses a Sequelize transaction and a row-level update lock when reading the event:

```js
const event = await Event.findByPk(id, {
  transaction: t,
  lock: t.LOCK.UPDATE,
});
```

It checks whether enough tickets remain, creates the booking, and decreases the event's available ticket count inside the same transaction.

This protects ticket inventory when multiple booking requests target the same event. If an operation inside the transaction fails, the database transaction rolls back the changes.

## Background Processing

BullMQ and Redis are used to process email tasks outside the main request flow.

- **Booking confirmation:** after a successful booking, the API adds a `bookingConfirmation` job to the email queue.
- **Event update notification:** when an organizer updates an event, a notification job is queued for customers who booked that event.

The worker consumes queued jobs and sends emails using Nodemailer. The API and worker should be run as separate processes in deployment environments that support background workers.

## API Quick Reference

### List events

```http
GET /api/v1/events
```

Returns the events available through the events API.

### Create a booking

```http
POST /api/v1/bookings/:id
Authorization: Bearer <CUSTOMER_TOKEN>
Content-Type: application/json
```

Example request body:

```json
{
  "totalBoughtTickets": 1
}
```

Replace `:id` with the event UUID and provide a valid customer access token.

## Load Testing with k6

The following results were collected locally using k6. They describe the specific test runs and are not claims about production capacity.

### 1. Events GET endpoint

**Test profile:** staged load, increasing through 10, 25, 50, and 100 virtual users over 40 seconds.

| Metric | Result |
|---|---:|
| Maximum configured VUs | 100 |
| Maximum active VUs observed | 99 |
| Total requests | 1,238 |
| Successful checks | 1,238 / 1,238 (100%) |
| HTTP failures | 0% |
| Average response time | 1.20 s |
| Median response time | 926.14 ms |
| p90 response time | 2.57 s |
| p95 response time | 2.84 s |
| Maximum response time | 3.51 s |
| Request rate | 28.50 requests/s |

**Result:** All 1,238 requests passed the HTTP 200 status check during this test.

### 2. Create booking endpoint

**Test profile:** 50 virtual users, one booking iteration per VU, targeting the same event. Each request attempted to book one ticket.

| Metric | Result |
|---|---:|
| Virtual users | 50 |
| Booking requests | 50 |
| Successful checks | 50 / 50 (100%) |
| HTTP failures | 0% |
| Average response time | 28.79 s |
| Median response time | 28.91 s |
| p90 response time | 29.54 s |
| p95 response time | 29.67 s |
| Maximum response time | 29.70 s |
| Request rate | 1.68 requests/s |

**Result:** All 50 requests returned successful booking responses in this run.

**Important:** This run demonstrates successful concurrent booking responses, but it does not by itself prove that inventory was decremented correctly in the database. Verify the event's remaining ticket count and booking records when presenting the result.

### Performance notes

- The GET test completed 1,238 requests with no failed HTTP checks.
- The 50-user booking test completed all 50 booking requests, but response times were high.
- A previous 50-user booking run had an average response time of 20.3 seconds and p95 of 21.08 seconds. The later run recorded 28.79 seconds average and 29.67 seconds p95.
- These two booking runs do not demonstrate a performance improvement. They should be presented as separate test observations, not as a before-and-after improvement.
- Requests competing for the same event inventory can wait on the database row lock.

## Running Locally

1. Clone the repository:

```bash
git clone https://github.com/TrainedDev/Event-Booking.git
cd Event-Booking
```

2. Install dependencies:

```bash
npm install
```

3. Configure the environment variables required by the application. Do not commit real secrets, database passwords, JWT secrets, or SMTP credentials.

4. Ensure PostgreSQL and Redis are available, then run the database setup/migrations used by the project.

5. Start the API using the start script defined in `package.json`.

6. Start the BullMQ worker using the worker script defined in `package.json` (run it as a separate process).

> Check the actual scripts in `package.json`; command names may differ between environments.

## Load Test Commands

Run the events GET test:

```bash
k6 run tests/get-events.js
```

Run the booking concurrency test:

```bash
k6 run tests/create-booking.js
```

Ensure the API, database, Redis, test event, and customer token are configured before running the booking test. Use a test event with sufficient remaining tickets for a successful-booking load test.

## Design Decisions and AI Assistance

AI tools were used as development support to explore implementation approaches, understand potential bottlenecks, and assist with debugging. The final implementation was reviewed and tested by the developer.

Key design decisions:

- Use database transactions to keep booking creation and ticket inventory updates consistent.
- Use a row-level update lock to protect the same event's ticket inventory from conflicting concurrent bookings.
- Move email delivery to BullMQ background jobs so email sending is handled outside the main API request.
- Use k6 to observe API behavior under concurrent load.

## Notes

- Load-test results are from a local environment and depend on the machine, database, Redis instance, and test data.
- The reported VU count is the number of virtual users in the k6 test, not a guaranteed number of real-world users the application can support.
- Confirm worker logs and email delivery separately before claiming that emails were delivered successfully.
