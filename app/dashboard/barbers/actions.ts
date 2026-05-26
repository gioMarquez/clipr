'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createBarber(formData: FormData) {
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const specialty = formData.get('specialty') as string

    await prisma.barber.create({
        data: { name, phone, specialty },
    })

    revalidatePath('/dashboard/barberos')
}

export async function updateBarber(formData: FormData) {
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const specialty = formData.get('specialty') as string

    await prisma.barber.update({
        where: { id },
        data: { name, phone, specialty },
    })

    revalidatePath('/dashboard/barberos')
}

export async function deleteBarber(formData: FormData) {
    const id = formData.get('id') as string

    await prisma.barber.delete({
        where: { id },
    })

    revalidatePath('/dashboard/barberos')
}