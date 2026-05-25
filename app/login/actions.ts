'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/session'

export async function loginUser(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) throw new Error('Usuario no encontrado')

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) throw new Error('Contraseña incorrecta')

    await createSession({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
    })

    redirect('/dashboard')
}