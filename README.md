# Food Delivery Microservices

An event-driven food delivery application built with [NestJS](https://nestjs.com/), [RabbitMQ](https://www.rabbitmq.com/), and [Drizzle ORM](https://orm.drizzle.team/).

## Architecture

The project consists of three distinct microservices communicating asynchronously via RabbitMQ message queues.

1. **Orders Service (API Gateway)**
   - Exposes a REST API (`POST /orders`) to accept new orders.
   - Saves order details to the database with a `PENDING` status.
   - Emits an `order_created` event to the `kitchen_queue`.

2. **Kitchen Service**
   - Subscribes to the `kitchen_queue`.
   - Processes incoming `order_created` events and creates a kitchen ticket in the database.
   - Simulates preparation time.
   - Emits an `order_ready` event to the `rider_queue`.

3. **Rider Service**
   - Subscribes to the `rider_queue`.
   - Processes `order_ready` events.
   - Automatically assigns a random available rider (e.g., Mike, Alex, Joe) and saves the dispatch details to the database.

## Technologies Used

- **Framework**: [NestJS](https://nestjs.com/)
- **Message Broker**: [RabbitMQ](https://www.rabbitmq.com/) (running via Docker Compose)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: Serverless PostgreSQL (Neon DB)

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose (for RabbitMQ)
- A PostgreSQL Database (e.g., Neon DB)

## Getting Started

### 1. Infrastructure Setup

Start the RabbitMQ instance using Docker Compose:

```bash
docker-compose up -d
```

RabbitMQ Management UI will be available at `http://localhost:15672` (Credentials: `guest` / `guest`).

### 2. Environment Variables

Create a `.env` file in each of the microservice directories (`orders-service`, `kitchen-service`, `rider-service`) with the following standard variables:

```env
# RabbitMQ Connection
RABBIT_MQ_URL=amqp://guest:guest@localhost:5672

# Database Connection (Neon DB / PostgreSQL)
DATABASE_URL=postgres://user:password@host/dbname

# Orders Service Port (only needed in orders-service)
PORT=3000
```

### 3. Database Migration

Navigate to each service directory, install dependencies, and run database migrations:

```bash
cd orders-service
npm install
npm run db:generate
npm run db:migrate

# Repeat for kitchen-service and rider-service
```

### 4. Running the Microservices

You need to run each service in a separate terminal:

**Terminal 1 (Orders Service)**:
```bash
cd orders-service
npm run start:dev
```

**Terminal 2 (Kitchen Service)**:
```bash
cd kitchen-service
npm run start:dev
```

**Terminal 3 (Rider Service)**:
```bash
cd rider-service
npm run start:dev
```

## Testing the Flow

Send a `POST` request to the Orders Service to trigger the microservices workflow:

```bash
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{
  "customerName": "John Doe",
  "item": "Pepperoni Pizza",
  "quantity": 1
}'
```

Watch the terminal outputs across the three services:
1. **Orders Service** will log the database save and event emission.
2. **Kitchen Service** will receive the event, save the ticket, wait 2 seconds, and emit the ready event.
3. **Rider Service** will receive the ready event, dispatch a rider, and log the final assignment.
