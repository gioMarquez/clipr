'use server'

import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getSession, createSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const session = await getSession()
    if (!session) throw new Error('No autorizado')

    const name = formData.get('name') as string
    const username = formData.get('username') as string
    const phone = formData.get('phone') as string

    const user = await prisma.user.update({
        where: { id: session.id },
        data: { name, username, phone },
    })

    await createSession({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
    })

    revalidatePath('/dashboard/perfil')
}

export async function updatePassword(formData: FormData) {
    const session = await getSession()
    if (!session) throw new Error('No autorizado')

    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string

    const user = await prisma.user.findUnique({ where: { id: session.id } })
    if (!user) throw new Error('Usuario no encontrado')

    const match = await bcrypt.compare(currentPassword, user.password)
    if (!match) throw new Error('Contraseña actual incorrecta')

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
        where: { id: session.id },
        data: { password: hashed },
    })

    revalidatePath('/dashboard/perfil')
}