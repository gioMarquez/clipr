import { prisma } from '@/lib/prisma'
import ReservaForm from './ReservaForm'

export default async function ReservarPage() {
    const barbers = await prisma.barber.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true, specialty: true },
    })

    const services = await prisma.service.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true, price: true, duration: true },
    })

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-blue-600">✂ CLIPR</h1>
                    <p className="text-gray-500 text-sm mt-1">Agenda tu cita en línea</p>
                </div>
                <ReservaForm barbers={barbers} services={services}/>
            </div>
        </div>
    )
}