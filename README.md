# MyDrive

![](./client/public/favicon.png)

A top down copy of Google Drive's core feature -- personal file upload and retrieval.

Features
- create an account with basic email and password, login, authenticated routes
- bulk document upload form with validation
- documents are stored in a MongoDB instance.

## Tech Stack and Arch

- Language: TypeScript
- Frontend: ReactJS, Redux, React Query, Tailwind CSS (pretty standard)
    - Testing:
      - Unit Testing: Jest+React Testing Library (todo)
      - E2E Testing: Playwright (todo)
- Backend: ExpressJS, MongoDB
- Auth: JWT + simple username email and password
- Arch: Microservices. Instead of a spaghetti mess of services calling each other with some internal API, isn't better and a wonderful idea to then expand that spaghetti and introduce network requests into the fray...? 

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

## TODO:

- [ ] Client retrieve small files instantly.
- [ ] Client retrieve large files in chunks.
- [ ] Be able to cresume uploads if a large in progress upload dropped
- [ ] Update OAuth secuirty: make long lived JWT token refresh token and to be used to request for short lived access tokens
