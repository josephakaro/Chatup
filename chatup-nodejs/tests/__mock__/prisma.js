// tests/__mocks__/prisma.js

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Mock methods you intend to use
prisma.user = {
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
}

prisma.group = {
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

prisma.message = {
  findMany: jest.fn(),
  create: jest.fn(),
  count: jest.fn(),
}

export default prisma
