# Document Import Tool (DIT)

Implementation of a Full-featured web app for authenticated forms and bulk document upload with validation and storage in a potentially distributed MongoDB.

## Tech Stack

- Full stack Typescript
- Frontend: ReactJS, Redux, React Query, Tailwind CSS
- Testing:
  - Unit Testing: Jest, React Testing Library (but we are using vite lmao)
  - E2E Testing: Cypress
- Backend: ExpressJS, MongoDB
- Auth: JWT authentication with simple username email and password

TODO:

- secure login using short lived JWT token
- server issues a refresh token if about to expire and user still logged in

## Microservices Architecture

An attempt at creating a microservices architecture for the backend, by essentially creating multiple API services that do different tasks each
with a well defined API endpoints.

### Client Static content server, service

Default PORT: 5173

### Auth and User service

Default PORT: 4000

Auth and User DB:

- Default PORT: 4001

### Form Validation service

Default PORT: 4010

Form Validation DB

- Default PORT: 4011

### Sessions/Upload service

Default PORT: 4020

Form and Files DB

- Default PORT: 4021

### Notification service

Default PORT: 4030

## Features

### Dynamic Forms, Validation, and Wizard GUI

### Chunked Uploads

Trying to understand how to send a large file across the wire
using fullstack TS and how to keep track of stuff while chunking up larger document
uploads.
