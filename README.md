## Express Router and Routes

| Route           | HTTP Verb | Route Middleware   | Description                          |
| --------------- | --------- | ------------------ | ------------------------------------ |
| /users      | GET       |                    | Get list of users                    |
| /users      | POST      |                    | Creates a new user                   |
| users/:id  | GET       | `isAuthenticated`  | Get a single user                    |
   
## Usage
### Basic example **Create USER** `/user`:

Request Body:
```json
{
  "name": "CRISTIAN MORENO",
  "email": "khriztianmoreno@myemail.com",
  "password": "my-secret-password"
}
```

Response:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OWFiNzkyMWQ1Yzk3NjJlZGQzZmUwZDgiLCJpYXQiOjE1MDQ0MDk4ODksImV4cCI6MTUwNDQyNzg4OX0.2gZPXZ-dQc3kQ1fcIDryHm4gIqWLvcw6guAOnP0ueGU"
}
```
### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Developing

1. Run `npm install` to install server dependencies.

2. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running

3. Run `npm run dev` to start the development server. It should automatically open the client in your browser when ready.

4. Open browser `http://localhost:4000/`.
