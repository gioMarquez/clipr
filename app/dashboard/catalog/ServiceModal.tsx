'use client'

import { useState } from 'react'
import CustomInput from '@/app/components/CustomInput'
import { createService, updateService } from './actions'

interface Service {
    id: string
    name: string
    price: number
    duration: number
    description: string | null
}

interface Props {
    service?: Service
    onClose: () => void
}

export default function ServiceModal({ service, onClose }: Props) {
    const [form, setForm] = useState({
        name: service?.name ?? '',
        price: service?.price.toString() ?? '',
        duration: service?.duration.toString() ?? '',
        description: service?.description ?? '',
    })

    const [touched, setTouched] = useState({
        name: false, price: false, duration: false, description: false,
    })

    const [error, setError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setTouched(prev => ({ ...prev, [e.target.name]: true }))

    const errors = {
        name: !form.name.trim() || form.name.trim().length < 2 ? 'Mínimo 2 caracteres' : null,
        price: isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0 ? 'Precio inválido' : null,
        duration: isNaN(parseInt(form.duration)) || parseInt(form.duration) < 5 ? 'Mínimo 5 minutos' : null,
    }

    const isValid = Object.values(errors).every(e => e === null)
    const action = service ? updateService : createService

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {service ? 'Editar servicio' : 'Agregar servicio'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                </div>

                <form
                    action={async (formData) => {
                        try {
                            await action(formData)
                            onClose()
                        } catch (e) {
                            setError(e instanceof Error ? e.message : 'Error al guardar')
                        }
                    }}
                    className="flex flex-col gap-3"
                >
                    {service && <input type="hidden" name="id" value={service.id} />}

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Nombre *</label>
                        <CustomInput
                            name="name" type="text" value={form.name}
                            onChange={handleChange} onBlur={handleBlur}
                            placeholder="Ej. Corte hombre"
                        />
                        {touched.name && errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-500">Precio (MXN) *</label>
                            <CustomInput
                                name="price" type="number" value={form.price}
                                onChange={handleChange} onBlur={handleBlur}
                                placeholder="Ej. 150" min="0" step="0.50"
                            />
                            {touched.price && errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-500">Duración (min) *</label>
                            <CustomInput
                                name="duration" type="number" value={form.duration}
                                onChange={handleChange} onBlur={handleBlur}
                                placeholder="Ej. 30" min="5" step="5"
                            />
                            {touched.duration && errors.duration && <p className="text-red-500 text-xs">{errors.duration}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Descripción</label>
                        <textarea
                            name="description" value={form.description}
                            onChange={handleChange} onBlur={handleBlur}
                            placeholder="Ej. Corte clásico para caballero con tijera y máquina"
                            rows={3}
                            className="w-full p-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 transition text-black text-sm resize-none"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-2 justify-end pt-2">
                        <button
                            type="button" onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit" disabled={!isValid}
                            className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {service ? 'Guardar cambios' : 'Agregar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}