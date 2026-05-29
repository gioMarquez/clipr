'use client'

import { useState } from 'react'
import { deleteService } from './actions'
import ServiceModal from './ServiceModal'

interface Service {
    id: string
    name: string
    price: number
    duration: number
    description: string | null
    _count: { appointments: number }
}

export default function ServiceList({ services }: { services: Service[] }) {
    const [modal, setModal] = useState<'create' | 'edit' | null>(null)
    const [selected, setSelected] = useState<Service | null>(null)

    const openEdit = (s: Service) => { setSelected(s); setModal('edit') }
    const closeModal = () => { setModal(null); setSelected(null) }

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Servicios</h1>
                    <p className="text-sm text-gray-400 mt-1">{services.length} servicios registrados</p>
                </div>
                <button
                    onClick={() => setModal('create')}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-neutral-800 transition hover:scale-[1.02] active:scale-95"
                >
                    + Agregar servicio
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Nombre</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Descripción</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Duración</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Precio</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Citas</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {services.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                                    No hay servicios registrados aún
                                </td>
                            </tr>
                        ) : services.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50 transition">
                                <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                                <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{s.description ?? '—'}</td>
                                <td className="px-4 py-3 text-gray-500">{s.duration} min</td>
                                <td className="px-4 py-3 font-medium text-gray-900">${s.price.toLocaleString('es-MX')} MXN</td>
                                <td className="px-4 py-3">
                                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                        {s._count.appointments} cita{s._count.appointments !== 1 ? 's' : ''}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2 justify-end">
                                        <button
                                            onClick={() => openEdit(s)}
                                            className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-700"
                                        >
                                            Editar
                                        </button>
                                        <form action={deleteService}>
                                            <input type="hidden" name="id" value={s.id} />
                                            <button type="submit" className="text-xs px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition text-red-600">
                                                Eliminar
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modal === 'create' && <ServiceModal onClose={closeModal} />}
            {modal === 'edit' && selected && <ServiceModal service={selected} onClose={closeModal} />}
        </>
    )
}