// src/utils/encryption.js

const crypto = require("crypto")

const algorithm = "aes-256-cbc"
const key = Buffer.from(process.env.ENCRYPTION_KEY, "utf-8")
const iv = Buffer.from(process.env.ENCRYPTION_IV, "utf-8")

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  return encrypted
}

const decrypt = (encryptedText) => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(encryptedText, "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}

module.exports = {
  encrypt,
  decrypt,
}
