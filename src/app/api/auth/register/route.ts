import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const existingUsers = await prisma.user.count()
    if (existingUsers > 0) {
      return Response.json({ error: 'Registration is closed' }, { status: 403 })
    }

    const { email, password, name } = await req.json()

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'admin',
      },
    })

    return Response.json({ id: user.id, email: user.email, name: user.name }, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to register' }, { status: 500 })
  }
}
