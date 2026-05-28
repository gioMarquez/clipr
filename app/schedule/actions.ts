'use server'

import { prisma } from '@/lib/prisma'

const REGEX = {
    name: /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]{2,50}$/,
    phone: /^\d{10}$/,
    service: /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s+]{2,60}$/,
}

const SERVICES_ALLOWED = [
    'Corte clásico',
    'Corte + barba',
    'Barba',
    'Afeitado',
    'Corte infantil',
]

export async function createPublicAppointment(formData: FormData) {
    const name = (formData.get('name') as string)?.trim()
    const phone = (formData.get('phone') as string)?.trim()
    const barberId = (formData.get('barberId') as string)?.trim()
    const service = (formData.get('service') as string)?.trim()
    const date = (formData.get('date') as string)?.trim()
    const time = (formData.get('time') as string)?.trim()

    // — 1. Validación de campos —
    if (!name || !REGEX.name.test(name))
        throw new Error('Nombre inválido')
    if (!phone || !REGEX.phone.test(phone))
        throw new Error('Teléfono inválido')
    if (!SERVICES_ALLOWED.includes(service))
        throw new Error('Servicio no permitido')
    if (!date || !time)
        throw new Error('Fecha y hora requeridas')

    // — 2. Validar fecha no en el pasado —
    const dateTimeStr = `${date}T${time}:00`
    const appointmentDate = new Date(dateTimeStr)
    if (isNaN(appointmentDate.getTime()))
        throw new Error('Fecha u hora inválida')
    if (appointmentDate < new Date())
        throw new Error('No puedes agendar en el pasado')

    // — 3. Validar hora dentro del horario (8am - 8pm) —
    const [hours, minutes] = time.split(':').map(Number)
    if (hours < 8 || hours >= 20 || (hours === 20 && minutes > 0))
        throw new Error('Horario fuera de servicio (8:00 - 20:00)')

    // — 4. Validar que el barbero existe —
    const barber = await prisma.barber.findUnique({ where: { id: barberId } })
    if (!barber) throw new Error('Barbero no encontrado')

    // — 5. Validar doble reserva (±30 min del mismo barbero) —
    const windowStart = new Date(appointmentDate.getTime() - 30 * 60 * 1000)
    const windowEnd = new Date(appointmentDate.getTime() + 30 * 60 * 1000)

    const conflict = await prisma.appointment.findFirst({
        where: {
            barberId,
            status: { in: ['PENDING', 'CONFIRMED'] },
            date: { gte: windowStart, lte: windowEnd },
        },
    })
    if (conflict) throw new Error('El barbero ya tiene una cita en ese horario')

    // — 6. Buscar o crear cliente con findUnique —
    let client = await prisma.client.findUnique({ where: { phone } })
    if (!client) {
        client = await prisma.client.create({ data: { name, phone } })
    }

    // — 7. Crear cita —
    await prisma.appointment.create({
        data: {
            date: appointmentDate,
            service,
            price: 0,
            status: 'PENDING',
            barberId,
            clientId: client.id,
        },
    })
}