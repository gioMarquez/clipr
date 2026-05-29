import { prisma } from '@/lib/prisma'
import ServiceList from './ServiceList'

export default async function ServicesPage() {
    const services = await prisma.service.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { appointments: true } } },
    })

    return <ServiceList services={services} />
}