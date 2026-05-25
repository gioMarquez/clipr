const metrics = [
    { label: 'Citas hoy', value: '12', sub: '↑ 3 vs ayer' },
    { label: 'Pendientes', value: '4', sub: 'por confirmar' },
    { label: 'Ingresos hoy', value: '$1,840', sub: '↑ 12% vs ayer' },
    { label: 'Clientes nuevos', value: '3', sub: 'este mes: 28' },
]

const appointments = [
    { time: '09:00', name: 'Carlos Méndez', service: 'Corte + barba', barber: 'Luis G.', status: 'COMPLETED' },
    { time: '10:30', name: 'Roberto Díaz', service: 'Corte clásico', barber: 'Marco A.', status: 'CONFIRMED' },
    { time: '11:00', name: 'Andrés López', service: 'Afeitado', barber: 'Luis G.', status: 'CANCELLED' },
    { time: '12:00', name: 'Jorge Reyes', service: 'Corte + barba', barber: 'Marco A.', status: 'PENDING' },
    { time: '13:30', name: 'Miguel Torres', service: 'Corte clásico', barber: 'Luis G.', status: 'CANCELLED' },
    { time: '14:00', name: 'Pedro Sánchez', service: 'Corte + barba', barber: 'Marco A.', status: 'PENDING' },
]

const barbers = [
    { initials: 'LG', name: 'Luis González', appts: '6 citas · 4 completadas', income: '$920' },
    { initials: 'MA', name: 'Marco Aguilar', appts: '6 citas · 3 completadas', income: '$920' },
]

const statusStyle: Record<string, string> = {
    COMPLETED: 'bg-green-100 text-green-800',
    CONFIRMED: 'bg-blue-100  text-blue-800',
    PENDING: 'bg-amber-100 text-amber-800',
    CANCELLED: 'bg-red-100   text-red-800',
}

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            {/* Métricas */}
            <div className="grid grid-cols-4 gap-3">
                {metrics.map(m => (
                    <div key={m.label} className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                        <p className="text-2xl font-semibold text-gray-900">{m.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{m.sub}</p>
                    </div>
                ))}
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 gap-4">
                {/* Citas */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-medium text-gray-900">Citas de hoy</h2>
                        <span className="text-xs text-blue-600 cursor-pointer">Ver todas →</span>
                    </div>
                    <div className="flex flex-col divide-y divide-gray-100">
                        {appointments.map(a => (
                            <div key={a.time + a.name} className="flex items-center gap-3 py-2">
                                <span className="text-xs text-gray-400 w-11">{a.time}</span>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{a.name}</p>
                                    <p className="text-xs text-gray-400">{a.service} · {a.barber}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${statusStyle[a.status]}`}>
                                    {a.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Barberos */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-medium text-gray-900">Barberos activos hoy</h2>
                        <span className="text-xs text-blue-600 cursor-pointer">Gestionar →</span>
                    </div>
                    <div className="flex flex-col divide-y divide-gray-100">
                        {barbers.map(b => (
                            <div key={b.name} className="flex items-center gap-3 py-3">
                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-medium">
                                    {b.initials}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{b.name}</p>
                                    <p className="text-xs text-gray-400">{b.appts}</p>
                                </div>
                                <span className="text-sm font-medium text-blue-600">{b.income}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}