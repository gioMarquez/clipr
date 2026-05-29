'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const REGEX = {
    name: /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s+]{2,60}$/,
    description: /^.{2,200}$/,
}

export async function createService(formData: FormData) {
    const name = (formData.get('name') as string)?.trim()
    const price = parseFloat(formData.get('price') as string)
    const duration = parseInt(formData.get('duration') as string)
    const description = (formData.get('description') as string)?.trim()

    if (!name || !REGEX.name.test(name)) throw new Error('Nombre inválido')
    if (isNaN(price) || price < 0) throw new Error('Precio inválido')
    if (isNaN(duration) || duration < 5) throw new Error('Duración mínima 5 minutos')

    await prisma.service.create({
        data: { name, price, duration, description: description || null },
    })

    revalidatePath('/dashboard/catalog')
}

export async function updateService(formData: FormData) {
    const id = formData.get('id') as string
    const name = (formData.get('name') as string)?.trim()
    const price = parseFloat(formData.get('price') as string)
    const duration = parseInt(formData.get('duration') as string)
    const description = (formData.get('description') as string)?.trim()

    if (!name || !REGEX.name.test(name)) throw new Error('Nombre inválido')
    if (isNaN(price) || price < 0) throw new Error('Precio inválido')
    if (isNaN(duration) || duration < 5) throw new Error('Duración mínima 5 minutos')

    await prisma.service.update({
        where: { id },
        data: { name, price, duration, description: description || null },
    })

    revalidatePath('/dashboard/catalog')
}

export async function deleteService(formData: FormData) {
    const id = formData.get('id') as string
    await prisma.service.delete({ where: { id } })
    revalidatePath('/dashboard/catalog')
}