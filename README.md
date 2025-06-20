# E-Commerce Website

A robust and scalable e-commerce platform built with NestJS, a progressive Node.js framework.

## Features

* **User Management:** Handles user registration, authentication, and authorization with role-based access control (Admin, Seller, User).
* **Product Management:** Allows for the creation, retrieval, updating, and deletion of products, including searching and category-based filtering.
* **Order Management:** Enables users to create and manage orders.
* **Payment Processing:** Integrates a payment system to handle transactions, including processing and refunds.
* **Authentication:** Secures endpoints using JWT-based authentication and guards.
* **Database Integration:** Uses TypeORM to interact with a PostgreSQL database.

## Technologies Used

* **Framework:** [NestJS](https://nestjs.com/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Database:** [PostgreSQL](https://www.postgresql.org/)
* **ORM:** [TypeORM](https://typeorm.io/)
* **Authentication:** [Passport](http://www.passportjs.org/) with JWT Strategy
* **Validation:** [class-validator](https://github.com/typestack/class-validator), [class-transformer](https://github.com/typestack/class-transformer)
* **Containerization:** [Docker](https://www.docker.com/)

## Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/barispolatt/e-commerce-website.git](https://github.com/barispolatt/e-commerce-website.git)
    cd e-commerce-website
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the necessary environment variables. You can use the `docker-compose.yml` file as a reference for the required variables.

## Running the Application

### Development

To start the application in development mode with file watching, run:

```bash
npm run start:dev
