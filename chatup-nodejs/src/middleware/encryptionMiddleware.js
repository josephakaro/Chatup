// Desc: Middleware to encrypt and decrypt message content
// Auth: Webstack Portfolio, 2024
// Date: 2024-10-12

const { encrypt, decrypt } = require("../utils/encryption")

// Middleware to encrypt message content before saving
const encryptMessage = (req, res, next) => {
  const { content } = req.body
  if (content) {
    req.body.content = encrypt(content)
  }
  next()
}

// Utility function to decrypt message content after retrieving
const decryptMessage = (message) => {
  if (message.content) {
    message.content = decrypt(message.content)
  }
  return message
}

module.exports = {
  encryptMessage,
  decryptMessage,
}
