# Auth Service

RESTful API that exposes an authentication service for the app allowing the user to create an account, login with their credentials and receive
a JWT for their future authenticated requests like doing input form validation and document uploads.

POST /auth/v1/login
POST /auth/v1/logout
GET /auth/v1/refresh

POST /user/v1
GET /user/v1
