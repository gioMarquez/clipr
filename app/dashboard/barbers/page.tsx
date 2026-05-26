import { prisma } from '@/lib/prisma'
import BarberList from './BarberList'

export default async function BarberosPage() {
    const barbers = await prisma.barber.findMany({
        orderBy: { createdAt: 'asc' },
        include: { _count: { select: { appointments: true } } },
    })

    return <BarberList barbers={barbers} />
}