# Chat Application Backend API Documentation

This document outlines the RESTful APIs for the backend of a chat application similar to WhatsApp. The backend is built using Node.js, Express.js, Socket.io for real-time communication, MongoDB for data storage, and Prisma ORM for database interactions. The application follows the MVC (Model-View-Controller) architecture and includes both email and Google authentication. All messages are encrypted before being stored in MongoDB using encryption middleware.

<br>

## Table of Contents

1. [Authentication APIs](#authentication-apis)
   - [Register with email](#register-with-email)
   - [Login with Email](#login-with-email)
   - [Login with Google](#login-with-google)
   - [Logout](#logout)
2. [User APIs](#group-apis)
   - [Get User Profile](#get-user-profile)
   - [Update User Profile](#update-user-profile)
3. [Group APIs](#group-apis)
   - [Create Group](#create-group)
   - [Get Group Details](#get-group-details)
   - [Add Members to Group](#add-members-to-group)
   - [Remove Members from Group](#remove-members-from-group)
   - [Delete Group](#remove-members-from-group)
4. [Message APIs](#message-apis)
   - [Send Private Message](#send-private-message)
   - [Send Group Message](#send-private-message)
   - [Get Private Message](#get-private-message)
   - [Get Group Message](#get-group-message)
5. [Socket.io Events](#socketio-events)
   - [Connection](#connection)
   - [Disconnect](#disconnect)
   - [Recieve Message](#recieve-message)
   - [Typing Indicator](#typing-indicator)
6. [Middleware](#middleware)
   - [Authentication Middleware](#authentication-middleware)
   - [Encryption Middleware](#encryption-middleware)
7. [Error Handling](#error-handling)
8. [Authentication Mechanism](#authentication-mechanism)

<br>

## Authentication APIs

### Register with Email

Endpoint: `/api/auth/register`

Method: `POST`

Description: Register a new User using email and password

Request Body:

```json
{
  "email": "example@gmail.com",
  "password": "password123",
  "name": "Joseph Doe"
}
```

   <br>

Responses:

- 201 Created

  ```json
  {
    "message": "User registered successfully.",
    "user": {
      "id": "127986126378623981269",
      "email": "example@gmail.com",
      "password": "password123",
      "name": "Joseph Doe",
      "createdAt": "2024-04-27T10:00:00Z"
    }
  }
  ```

- 400 Bad Request

  ```json
  {
    "error": "Email already in use."
  }
  ```

- 500 Internal Server Error
  ```json
  {
    "error": "Server error. Please try again later."
  }
  ```

### Login with Email

Endpoint: `/api/auth/login`

Method: `POST`

Description: Authenticates a user using email and password.

Request Body:

```json
{
  "email": "example@gmail.com",
  "password": "password123"
}
```

Responses:

- 200 OK

  ```json
  {
    "message": "Login successful.",
    "token": "jwt-token-string",
    "user": {
      "id": "127986126378623981269",
      "email": "example@gmail.com",
      "name": "Joseph Doe"
    }
  }
  ```

- 401 Unauthorized

  ```json
  {
    "error": "Invalid email or password."
  }
  ```

- 500 Internal Server Error

  ```json
  {
    "error": "Server error. Please try again later."
  }
  ```

### Login with Google

Endpoint: `/api/auth/google`

Method: `POST`

Request Body:

```json
{
  "tokenId": "google-0auth-token-id"
}
```

<br>

Responses:

- 200 OK

  ```json
  {
    "message": "Login successful.",
    "token": "jwt-token-string",
    "user": {
      "id": "userId123",
      "email": "user@gmail.com",
      "name": "John Doe",
      "avatar": "https://googleusercontent.com/avatar.jpg"
    }
  }
  ```

- 400 Bad Request

  ```json
  {
    "message": "Login successful.",
    "token": "jwt-token-string",
    "user": {
      "id": "userId123",
      "email": "user@gmail.com",
      "name": "John Doe",
      "avatar": "https://googleusercontent.com/avatar.jpg"
    }
  }
  ```

- 500 Internal Server Error

  ```json
  {
    "error": "Server error. Please try again later."
  }
  ```

### Logout

Endpoint: `/api/auth/logout`

Method: `POST`

Description: Log out the authenticated user by invalidating the JWT token.

Headers:

```makefile
Authorization: Bearer <jwt-token>
```

Responses

- 200 OK

  ```json
  {
    "message": "Logout successful."
  }
  ```

- 401 Unauthorized

  ```json
  {
    "error": "Invalid or missing token."
  }
  ```

- 500 Internal Server Error

  ```json
  {
    "error": "Server error. Please try again later."
  }
  ```

## User APIs

### Get User Profile

### Update User Profile

## Group APIs

### Create Group

### Get Group Details

### Add Members to Group

### Remove Members from Group

### Delete Group

## Message APIs

### Send Private Message

### Send Group Message

### Get Private Message

### Get Group Message

## Socket.io Events

### Connection

### Disconnect

### Recieve Message

### Typing Indicator

## Middleware

### Authentication Middleware

### Encryption Middleware

## Error Handling

## Authentication Mechanism
