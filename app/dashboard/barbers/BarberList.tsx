'use client'

import { useState } from 'react'
import { deleteBarber } from './actions'
import BarberModal from './BarberModal'

interface Barber {
    id: string
    name: string
    phone: string | null
    specialty: string | null
    _count: { appointments: number }
}

export default function BarberList({ barbers }: { barbers: Barber[] }) {
    const [modal, setModal] = useState<'create' | 'edit' | null>(null)
    const [selected, setSelected] = useState<Barber | null>(null)

    const openEdit = (barber: Barber) => {
        setSelected(barber)
        setModal('edit')
    }

    const closeModal = () => {
        setModal(null)
        setSelected(null)
    }

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Barberos</h1>
                    <p className="text-sm text-gray-400 mt-1">{barbers.length} barberos registrados</p>
                </div>
                <button
                    onClick={() => setModal('create')}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-neutral-800 transition hover:scale-[1.02] active:scale-95"
                >
                    + Agregar barbero
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {barbers.map(barber => (
                    <div key={barber.id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-medium">
                                {barber.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{barber.name}</p>
                                <p className="text-xs text-gray-400">{barber.specialty ?? 'Sin especialidad'}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 text-sm text-gray-500">
                            <p>📞 {barber.phone ?? 'Sin teléfono'}</p>
                            <p>✂ {barber._count.appointments} citas en total</p>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                            <button
                                onClick={() => openEdit(barber)}
                                className="flex-1 text-sm py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-700"
                            >
                                Editar
                            </button>
                            <form action={deleteBarber}>
                                <input type="hidden" name="id" value={barber.id} />
                                <button
                                    type="submit"
                                    className="text-sm py-1.5 px-3 border border-red-200 rounded-lg hover:bg-red-50 transition text-red-600"
                                >
                                    Eliminar
                                </button>
                            </form>
                        </div>
                    </div>
                ))}

                {barbers.length === 0 && (
                    <div className="col-span-3 text-center py-16 text-gray-400">
                        <p className="text-4xl mb-3">✂</p>
                        <p className="text-sm">No hay barberos registrados aún</p>
                    </div>
                )}
            </div>

            {modal === 'create' && <BarberModal onClose={closeModal} />}
            {modal === 'edit' && selected && <BarberModal barber={selected} onClose={closeModal} />}
        </>
    )
}