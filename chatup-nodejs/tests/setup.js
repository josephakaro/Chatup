// tests/setup.js

process.env.JWT_SECRET = "test_jwt_secret"
process.env.JWT_EXPIRES_IN = "1h"
process.env.ENCRYPTION_KEY = "12345678901234567890123456789012" // 32 chars
process.env.ENCRYPTION_IV = "1234567890123456" // 16 chars
