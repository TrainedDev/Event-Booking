# Event Booking API

A backend application for managing events and customer ticket bookings, featuring role-based access control, transactional ticket inventory management, and asynchronous email notifications using Redis and BullMQ.

**Repository:** [GitHub - Event Booking](https://github.com/TrainedDev/Event-Booking)

## Quick Access

| Resource | URL |
|---|---|
| GitHub Repository | [Event-Booking](https://github.com/TrainedDev/Event-Booking) |
| Deployed API | [Event Booking API](https://event-booking-1-avvi.onrender.com/) |
| Background Worker | [Event Booking Worker](https://event-booking-worker-gtsu.onrender.com/) |
| Events API | [GET /api/v1/events](https://event-booking-1-avvi.onrender.com/api/v1/events) |
| Create Booking API | POST /api/v1/bookings/:id |
| API Base URL | `https://event-booking-1-avvi.onrender.com` |
| Worker Service | `https://event-booking-worker-gtsu.onrender.com` |
| Load Testing | k6 |

**Note:** The worker is a separate background service that consumes BullMQ jobs from Redis. Its deployment URL is provided for service access, not as a replacement for the booking API.

## Tech Stack

- Node.js and Express
- PostgreSQL
- Sequelize ORM
- JWT Authentication and Role-Based Authorization
- Redis and BullMQ
- Nodemailer
- k6 for Load Testing

## Main Features

- User authentication and role-based access for Organizers and Customers.
- Organizers can create and update events.
- Customers can browse events and book tickets.
- Transactional ticket inventory management.
- Row-level database locking for concurrent booking requests.
- Asynchronous booking confirmation emails.
- Event update notifications for customers who booked the event.
- Independent background worker for email processing.

## Booking Concurrency and Data Consistency

The booking service uses Sequelize transactions and row-level database locking when accessing event inventory.

```js
const event = await Event.findByPk(id, {
  transaction: t,
  lock: t.LOCK.UPDATE,
});
```

The service checks ticket availability, creates the booking, and decreases the available ticket count within the same transaction.

This prevents concurrent booking requests from incorrectly accessing the same ticket inventory.

If an operation fails, the transaction rolls back the database changes.

## Background Processing

BullMQ and Redis handle asynchronous email notifications outside the main API request flow.

Two types of jobs are processed:

1. **Booking Confirmation:** After a successful booking, the API queues a `bookingConfirmation` job.
2. **Event Update Notification:** When an organizer updates an event, notification jobs are queued for customers who booked that event.

The background worker runs independently from the main API server and consumes jobs from Redis.

Nodemailer handles email delivery.

**Architecture:**

```text
Customer / Organizer
        |
        v
   Express API
        |
        v
   PostgreSQL
        |
        v
   Redis Queue
        |
        v
 Independent Worker
        |
        v
   Nodemailer
        |
        v
   Email Delivery
```

## API Quick Reference

**Base URL:**

```text
https://event-booking-1-avvi.onrender.com
```

### 1. List Events

| Method | Endpoint |
|---|---|
| GET | `/api/v1/events` |

Full URL:

```http
GET https://event-booking-1-avvi.onrender.com/api/v1/events
```

Returns the available events.

### 2. Create Booking

| Method | Endpoint |
|---|---|
| POST | `/api/v1/bookings/:id` |

Full URL:

```http
POST https://event-booking-1-avvi.onrender.com/api/v1/bookings/:id
```

Headers:

```http
Authorization: Bearer <CUSTOMER_TOKEN>
Content-Type: application/json
```

Request body:

```json
{
  "totalBoughtTickets": 1
}
```

Replace `:id` with the event UUID and provide a valid customer access token.

### 3. Authentication

Authentication is handled through JWT-based authentication and role-based authorization.

- Organizer access for event management.
- Customer access for ticket booking.

Refer to the repository routes and controllers for the complete authentication endpoints.

## Deployment

The application is deployed on Render using separate services.

| Service | Deployment |
|---|---|
| Main API | [Open API](https://event-booking-1-avvi.onrender.com/) |
| Background Worker | [Open Worker](https://event-booking-worker-gtsu.onrender.com/) |

The API handles HTTP requests, while the independent worker processes background email jobs.

Both services use the configured PostgreSQL and Redis infrastructure.

## Load Testing with k6

The following results were collected using local k6 tests. They describe the specific test runs and are not guarantees of production capacity.

### 1. Events GET Endpoint

**Test profile:** Staged load increasing through 10, 25, 50, and 100 virtual users over 40 seconds.

| Metric | Result |
|---|---:|
| Maximum Configured VUs | 100 |
| Maximum Active VUs | 99 |
| Total Requests | 1,238 |
| Successful Checks | 1,238 / 1,238 (100%) |
| HTTP Failures | 0% |
| Average Response Time | 1.20 s |
| Median Response Time | 926.14 ms |
| p90 Response Time | 2.57 s |
| p95 Response Time | 2.84 s |
| Maximum Response Time | 3.51 s |
| Request Rate | 28.50 requests/s |

**Result:** All 1,238 requests passed the HTTP 200 status check.

### 2. Create Booking Endpoint

**Test profile:** 50 virtual users, one booking iteration per VU, targeting the same event. Each request attempted to book one ticket.

| Metric | Result |
|---|---:|
| Virtual Users | 50 |
| Booking Requests | 50 |
| Successful Checks | 50 / 50 (100%) |
| HTTP Failures | 0% |
| Average Response Time | 28.79 s |
| Median Response Time | 28.91 s |
| p90 Response Time | 29.54 s |
| p95 Response Time | 29.67 s |
| Maximum Response Time | 29.70 s |
| Request Rate | 1.68 requests/s |

**Result:** All 50 requests returned successful booking responses in this test run.

**Important:** Successful HTTP responses alone do not prove that ticket inventory was decremented correctly. Verify the database booking records and remaining ticket count when validating concurrency behavior.

### Performance Notes

- The GET test completed 1,238 requests without failed HTTP checks.
- The booking test completed all 50 requests successfully.
- Booking response times were high because requests competed for the same event inventory.
- A previous 