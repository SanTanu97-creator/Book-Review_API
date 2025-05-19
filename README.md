# Book Review API

A RESTful API for managing books and user reviews with authentication, built using Node.js, Express, MongoDB, and JWT.

---

## Table of Contents
- [Project Setup](#project-setup)
- [Running Locally](#running-locally)
- [API Endpoints & Example Requests](#api-endpoints--example-requests)
- [Design Decisions & Assumptions](#design-decisions--assumptions)
- [Database Schema](#database-schema)

---

## Project Setup

1. **Clone the repository**

```bash
git clone https://github.com/SanTanu97-creator/Book-Review_API.git
cd book-review-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment variables**

Create a `.env` file in the root directory and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. **Start MongoDB**

Make sure MongoDB is running locally or you have access to a MongoDB Atlas cluster.

---

## Running Locally

Start the development server with:

```bash
npm run dev
```

By default, the server runs on [http://localhost:5000](http://localhost:5000).

---

## API Endpoints & Example Requests

### Authentication

**Register**

```bash
curl -X POST http://localhost:5000/api/users/signup \
-H "Content-Type: application/json" \
-d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Login**

```bash
curl -X POST http://localhost:5000/api/users/login \
-H "Content-Type: application/json" \
-d '{"email":"john@example.com","password":"password123"}'
```

---

### Books

**Add a Book (Authenticated)**

```bash
curl -X POST http://localhost:5000/api/books \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-d '{"title":"Book Title","author":"Author Name","genre":"Fiction","description":"Book description"}'
```

**Get All Books**

```bash
curl http://localhost:5000/api/books?page=1&limit=10
```

**Get Book Details (including reviews & average rating)**

```bash
curl http://localhost:5000/api/books/BOOK_ID?page=1&limit=5
```

**Search Books**

```bash
curl http://localhost:5000/api/books/search?query=keyword&page=1&limit=10
```

---

### Reviews

**Add a Review (Authenticated, one review per user per book)**

```bash
curl -X POST http://localhost:5000/api/reviews \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-d '{"bookId":"BOOK_ID","rating":4,"comment":"Great read!"}'
```

**Update a Review (Authenticated, owner only)**

```bash
curl -X PUT http://localhost:5000/api/reviews/REVIEW_ID \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-d '{"rating":5,"comment":"Updated comment"}'
```

**Delete a Review (Authenticated, owner only)**

```bash
curl -X DELETE http://localhost:5000/api/reviews/REVIEW_ID \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get Reviews for a Book**

```bash
curl http://localhost:5000/api/reviews/book/BOOK_ID?page=1&limit=10
```

---

## Design Decisions & Assumptions

- **Authentication:** Uses JWT tokens passed in Authorization headers or cookies.
- **Authorization:** Users can only update or delete their own reviews.
- **Validation:** Middleware validators ensure required fields and data formats before controllers run.
- **One Review Per User Per Book:** Prevents multiple reviews by the same user on one book.
- **Pagination:** Implemented for books and reviews for scalability.
- **Error Handling:** Centralized error handler returns consistent JSON error responses.
- **No Admin Role Yet:** Currently, any authenticated user can add books (can be restricted later).

---

## Database Schema

### Collections

**User**

| Field      | Type      | Required | Notes                 |
|------------|-----------|----------|-----------------------|
| _id        | ObjectId  | Yes      | MongoDB generated ID  |
| name       | String    | Yes      | User's full name      |
| email      | String    | Yes      | Unique email address  |
| password   | String    | Yes      | Hashed password       |
| createdAt  | Date      | Yes      | Timestamp             |
| updatedAt  | Date      | Yes      | Timestamp             |

**Book**

| Field       | Type      | Required | Notes               |
|-------------|-----------|----------|---------------------|
| _id         | ObjectId  | Yes      | MongoDB generated ID|
| title       | String    | Yes      | Book title          |
| author      | String    | Yes      | Book author         |
| genre       | String    | Yes      | Book genre          |
| description | String    | No       | Optional description|
| createdAt   | Date      | Yes      | Timestamp           |
| updatedAt   | Date      | Yes      | Timestamp           |

**Review**

| Field      | Type      | Required | Notes                           |
|------------|-----------|----------|---------------------------------|
| _id        | ObjectId  | Yes      | MongoDB generated ID            |
| book       | ObjectId  | Yes      | Reference to a Book             |
| user       | ObjectId  | Yes      | Reference to the User           |
| rating     | Number    | Yes      | 1 to 5                         |
| comment    | String    | No       | Optional review comment         |
| createdAt  | Date      | Yes      | Timestamp                      |
| updatedAt  | Date      | Yes      | Timestamp                      |

---

