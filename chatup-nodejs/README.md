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

Endpoint: `/api/users/profile`

Method: `GET`

Description: Retrieves the authenticated user's profile information.

Headers:

```makefile
Authorization: Bearer <jwt-token>
```

Responses

- 200 OK

  ```json
  {
    "user": {
      "id": "userId123",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2024-04-27T10:00:00Z"
    }
  }
  ```

- 401 Unauthorized

  ```json
  {
    "error": "Invalid or missing token."
  }
  ```

- 404 Not Found

  ```json
  {
    "error": "User not found."
  }
  ```

- 500 Internal Server Error

  ```json
  {
    "error": "Server error. Please try again later."
  }
  ```

### Update User Profile

Endpoint: `/api/users/profile`

Method: `PUT`

Description: Updates the authenticated user's profile information.

Headers:

```makefile
Authorization: Bearer <jwt-token>
```

<br>

Request Body

```json
{
  "name": "John Doe Updated",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

<br>

Responses

- 200 OK

  ```json
  {
    "message": "Profile updated successfully.",
    "user": {
      "id": "userId123",
      "email": "user@example.com",
      "name": "John Doe Updated",
      "avatar": "https://example.com/new-avatar.jpg",
      "updatedAt": "2024-04-28T12:00:00Z"
    }
  }
  ```

- 400 Bad Request

  ```json
  {
    "error": "Invalid input data."
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

<br>

## Group APIs

### Create Group

Endpoint: `/api/groups`

Method: `POST`

Description: Creates a new group with specified members.

Headers:

```makefile
Authorization: Bearer <jwt-token>
```

Request Body

```json
{
  "name": "Family Group",
  "members": ["userId123", "userId456", "userId789"]
}
```

Responses

- 201 Created

  ```json
  {
    "message": "Group created successfully.",
    "group": {
      "id": "groupId123",
      "name": "Web Stack Group",
      "members": ["userId123", "userId456", "userId789"],
      "createdAt": "2024-04-27T11:00:00Z"
    }
  }
  ```

- 400 Bad Request

  ```json
  {
    "error": "Invalid group data or members."
  }
  ```

- 401 Unauthorized

  ```json
  {
    "error": "Invalid or missing token."
  }
  ```

- 404 Not Found

  ```json
  {
    "error": "User not found."
  }
  ```

- 500 Internal Server Error

  ```json
  {
    "error": "Server error. Please try again later."
  }
  ```

### Get Group Details

Endpoint: `/api/groups/:groupId`

Method: `POST`

Description: Creates a new group with specified members.

Headers:

```makefile
Authorization: Bearer <jwt-token>
```

<br>

Path Parameters

- `groupId` (string, required): The group Id

<br>

Responses

- 200 OK

  ```json
  {
    "group": {
      "id": "groupId123",
      "name": "web Stack Group",
      "members": [
        {
          "id": "userId123",
          "name": "John Doe",
          "email": "john@example.com"
        },
        {
          "id": "userId456",
          "name": "Jane Smith",
          "email": "jane@example.com"
        }
      ],
      "createdAt": "2024-04-27T11:00:00Z"
    }
  }
  ```

- 401 Unauthorized

  ```json
  {
    "error": "Invalid or missing token."
  }
  ```

- 403 Forbidden

  ```json
  {
    "error": "You are not a member of this group."
  }
  ```

- 404 Not Found

  ```json
  {
    "error": "User not found."
  }
  ```

- 500 Internal Server Error

  ```json
  {
    "error": "Server error. Please try again later."
  }
  ```

<br>

### Add Members to Group

Endpoint: `/api/groups/:groupId/members`

Method: `POST`

Description: Adds new members to an existing group.

Headers:

```makefile
Authorization: Bearer <jwt-token>
```

<br>

Path Parameters

- `groupId` (string, required): The group Id

<br>

Request Body

```json
{
  "members": ["userId999", "userId888"]
}
```

<br>

Responses

- 200 OK

  ```json
  {
    "message": "Members added successfully.",
    "group": {
      "id": "groupId123",
      "members": [
        "userId123",
        "userId456",
        "userId789",
        "userId999",
        "userId888"
      ]
    }
  }
  ```

- 400 Bad Request

  ```json
  {
    "error": "Invalid member IDs."
  }
  ```

- 401 Unauthorized

  ```json
  {
    "error": "Invalid or missing token."
  }
  ```

- 403 Forbidden

  ```json
  {
    "error": "You are not authorized to modify this group."
  }
  ```

- 404 Not Found

  ```json
  {
    "error": "Group not found."
  }
  ```

- 500 Internal Server Error

  ```json
  {
    "error": "Server error. Please try again later."
  }
  ```

  <br>

### Remove Members from Group

Endpoint: `/api/groups/:groupId/members`

Method: `DELETE`

Description: Removes members from an existing group.

Headers:

```makefile
Authorization: Bearer <jwt-token>
```

<br>

Path Parameters

- `groupId` (string, required): The group Id

<br>

Request Body

```json
{
  "members": ["userId999"]
}
```

<br>

Responses

- 200 OK

  ```json
  {
    "message": "Members removed successfully.",
    "group": {
      "id": "groupId123",
      "members": ["userId123", "userId789"]
    }
  }
  ```

- 400 Bad Request

  ```json
  {
    "error": "Invalid member IDs."
  }
  ```

- 401 Unauthorized

  ```json
  {
    "error": "Invalid or missing token."
  }
  ```

- 403 Forbidden

  ```json
  {
    "error": "You are not authorized to modify this group."
  }
  ```

- 404 Not Found

  ```json
  {
    "error": "Group not found."
  }
  ```

- 500 Internal Server Error

  ```json
  {
    "error": "Server error. Please try again later."
  }
  ```

  <br>

### Delete Group

Endpoint: `/api/groups/:groupId`

Method: `DELETE`

Description: Deletes a group. Only group admins can delete the group.

Headers:

```makefile
Authorization: Bearer <jwt-token>
```

<br>

Path Parameters

- `groupId` (string, required): The group Id

<br>

Responses

- 200 OK

  ```json
  {
    "message": "Group deleted successfully."
  }
  ```

- 401 Unauthorized

  ```json
  {
    "error": "Invalid or missing token."
  }
  ```

- 403 Forbidden

  ```json
  {
    "error": "You are not authorized to delete this group."
  }
  ```

- 404 Not Found

  ```json
  {
    "error": "Group not found."
  }
  ```

- 500 Internal Server Error

  ```json
  {
    "error": "Server error. Please try again later."
  }
  ```

  <br>

## Message APIs

### Send Private Message

Endpoint: `/api/users/profile`

Method: `GET`

Description: Retrieves the authenticated user's profile information.

Headers:

```makefile
Authorization: Bearer <jwt-token>
```

Responses

- 200 OK

  ```json
  {
    "user": {
      "id": "userId123",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2024-04-27T10:00:00Z"
    }
  }
  ```

- 401 Unauthorized

  ```json
  {
    "error": "Invalid or missing token."
  }
  ```

- 404 Not Found

  ```json
  {
    "error": "User not found."
  }
  ```

- 500 Internal Server Error

  ```json
  {
    "error": "Server error. Please try again later."
  }
  ```

### Update User Profile

Endpoint: `/api/message/private`

Method: `POST`

Description: Sends a private message to another user.

Headers:

```makefile
Authorization: Bearer <jwt-token>
```

<br>

Request Body

```json
{
  "recipientId": "userId456",
  "content": "Hello, how are you?"
}
```

<br>

Responses

- 201 Created

  ```json
  {
    "message": "Message sent successfully.",
    "data": {
      "id": "messageId123",
      "senderId": "userId123",
      "recipientId": "userId456",
      "content": "EncryptedMessageContent",
      "createdAt": "2024-04-27T12:00:00Z"
    }
  }
  ```

- 400 Bad Request

  ```json
  {
    "error": "Invalid recipient ID or message content."
  }
  ```

- 401 Unauthorized

  ```json
  {
    "error": "Invalid or missing token."
  }
  ```

- 404 Not Found

  ```json
  {
    "error": "Recipient user not found."
  }
  ```

- 500 Internal Server Error

  ```json
  {
    "error": "Server error. Please try again later."
  }
  ```

<br>

### Send Group Message

Endpoint: `/api/message/group`

Method: `POST`

Description: Sends a message to a group.

Headers:

```makefile
Authorization: Bearer <jwt-token>
```

<br>

Request Body

```json
{
  "groupId": "groupId123",
  "content": "Hello, group!"
}
```

<br>

Responses

- 201 Created

  ```json
  {
    "message": "Message sent successfully.",
    "data": {
      "id": "messageId123",
      "senderId": "userId123",
      "recipientId": "userId456",
      "content": "EncryptedMessageContent",
      "createdAt": "2024-04-27T12:00:00Z"
    }
  }
  ```

- 400 Bad Request

  ```json
  {
    "error": "Invalid recipient ID or message content."
  }
  ```

- 401 Unauthorized

  ```json
  {
    "error": "Invalid or missing token."
  }
  ```

- 403 Forbidden

  ```json
  {
    "error": "You are not a member of this group."
  }
  ```

- 404 Not Found

  ```json
  {
    "error": "Group not found."
  }
  ```

- 500 Internal Server Error

  ```json
  {
    "error": "Server error. Please try again later."
  }
  ```

<br>

### Get Private Message

Endpoint: `/api/message/private/:recipientId`

Method: `GET`

Description: Retrieves private messages between the authenticated user and a specific recipient.

Headers:

```makefile
Authorization: Bearer <jwt-token>
```

Path Parameters:

- `recipientId`(string, required): The recipient ID.

<br>

Query Parameters:

- `page`(integer, optional): Page number for pagination (default: 1)
- `limit`(interger, optional): Number of messages per page (defailt: 50)

<br>

Responses

- 200 OK

```json
{
  "messages": [
    {
      "id": "messageId123",
      "senderId": "userId123",
      "recipientId": "userId456",
      "content": "EncryptedMessageContent",
      "createdAt": "2024-04-27T12:00:00Z"
    }
    // More messages...
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalMessages": 500
  }
}
```

- 400 Bad Request

  ```json
  {
    "error": "Invalid recipient ID"
  }
  ```

- 401 Unauthorized

  ```json
  {
    "error": "Invalid or missing token."
  }
  ```

- 403 Forbidden

  ```json
  {
    "error": "You are not authorized to view these messages."
  }
  ```

- 404 Not Found

  ```json
  {
    "error": "Recipient user not found."
  }
  ```

- 500 Internal Server Error

  ```json
  {
    "error": "Server error. Please try again later."
  }
  ```

<br>

### Get Group Message

Endpoint: `/api/message/group/:groupId`

Method: `GET`

Description: Retrieves messages from a specific group.

Headers:

```makefile
Authorization: Bearer <jwt-token>
```

Path Parameters:

- `groupId`(string, required): The group ID.

<br>

Query Parameters:

- `page`(integer, optional): Page number for pagination (default: 1)
- `limit`(interger, optional): Number of messages per page (defailt: 50)

<br>

Responses

- 200 OK

```json
{
  "messages": [
    {
      "id": "messageId124",
      "senderId": "userId123",
      "groupId": "groupId123",
      "content": "EncryptedGroupMessageContent",
      "createdAt": "2024-04-27T12:05:00Z"
    }
    // More messages...
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 20,
    "totalMessages": 1000
  }
}
```

- 400 Bad Request

  ```json
  {
    "error": "Invalid group ID"
  }
  ```

- 401 Unauthorized

  ```json
  {
    "error": "Invalid or missing token."
  }
  ```

- 403 Forbidden

  ```json
  {
    "error": "You are not a member of this group."
  }
  ```

- 404 Not Found

  ```json
  {
    "error": "Group not found."
  }
  ```

- 500 Internal Server Error

  ```json
  {
    "error": "Server error. Please try again later."
  }
  ```

<br>

## Socket.io Events

In addition to REST APIs, real-time functionalities are handled using Socket.io. Below are the primary events used.

### Connection

Event: `connect`

Description: Triggered when a client connects to the server via Socket.io.

Server Handling:

- Authenticate the user using the provided JWT token.
- Join the user to relevant rooms (e.g., personal room, group rooms).

Example:

```javascript
socket.on("connect", () => {
  console.log("New User is Connected!")
})
```

<br>

### Disconnect

Event: `disconnect`

Description: Triggered when a client disconnects from the server.

Server Handling:

- Remove the user from active rooms.
- Notify other users if necessary.

Example:

```javascript
socket.on("disconnect", () => {
  console.log("User is disconnected!")
})
```

<br>

### Recieve Message

Event: `sendMessage`

Description: Sends a message from one user to another or to a group in real-time.

Client Emission:

```javascript
socket.emit("sendMessage", {
  type: "private", // or 'group'
  recipientId: "userId456", // for private messages
  groupId: "groupId123", // for group messages
  content: "Hello!",
})
```

Server Handling:

- Validate and encrypt the message.
- Store the message in MongoDB.
- Emit the message to the recipient(s).

Server Emission:

```javascript
socket.emit("receiveMessage", {
  id: "messageId123",
  senderId: "userId123",
  content: "EncryptedMessageContent",
  createdAt: "2024-04-27T12:00:00Z",
})
```

<br>

### Typing Indicator

Event: `typing`

Description: Indicates that a user is typing a message.

Client Emission:

```javascript
socket.emit("typing", {
  type: "private", // or 'group'
  recipientId: "userId456", // for private
  groupId: "groupId123", // for group
})
```

Server Handling:

- Broadcast the typing status to the relevant recipient(s).

Server Emission:

```javascript
socket.broadcast.emit("typing", {
  userId: "userId123",
  type: "private",
  groupId: "groupId123",
})
```

<br>

## Middleware

### Authentication Middleware

Description: Verifies the JWT token provided in the `Authorization` header and attaches the user information to the request object.

Usage: Applied to routes that require authentication.

Example:

```javascript
const authenticate = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "")
  // Verify token and attach user to req.user
  next()
}
```

<br>

### Encryption Middleware

Description: Encrypts message content before storing it in the database and decrypts it when retrieving.

Usage: Applied to messaging routes.

Example:

```javascript
const encryptMessage = (req, res, next) => {
  const { content } = req.body
  req.body.content = encrypt(content)
  next()
}

const decryptMessage = (message) => {
  return decrypt(message.content)
}
```

<br>

## Error Handling

All APIs return standardized error responses with appropriate HTTP status codes and error messages. Common error responses include:

- `400` Bad Request: Invalid input data.
- `401` Unauthorized: Missing or invalid authentication token.
- `403` Forbidden: Insufficient permissions.
- `404` Not Found: Resource does not exist.
- `500` Internal Server Error: Unexpected server errors.

Ensure that sensitive information is not exposed in error messages.

## Authentication Mechanism

- <b>JWT (JSON Web Tokens)</b>: Used for authenticating API requests. Tokens are issued upon successful login (email or Google) and must be included in the `Authorization` header as `Bearer <token>` for protected routes.

- `<b>Token Expiry</b>: Tokens have a set expiration time. Refresh tokens can be implemented for token renewal if necessary.

- <b>Password Security</b>: Passwords are hashed using a secure hashing algorithm (e.g., bcrypt) before storing in the database.

- <b>Google OAuth</b>: Utilizes Google's OAuth 2.0 for authenticating users. The backend verifies the token ID received from the client to authenticate the user.
