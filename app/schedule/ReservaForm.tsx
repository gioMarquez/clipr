'use client'

import { useState } from 'react'
import { createPublicAppointment } from './actions'

interface Barber {
    id: string
    name: string
    specialty: string | null
}

interface ServiceOption {
    id: string
    name: string
    price: number
    duration: number
}

const REGEX = {
    name: /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]{2,50}$/,
    phone: /^\d{10}$/,
}

export default function ReservaForm({ barbers, services }: { barbers: Barber[], services: ServiceOption[] }) {
    const [form, setForm] = useState({
        name: '', phone: '', barberId: '', service: '', date: '', time: '',
    })
    const [touched, setTouched] = useState({
        name: false, phone: false, barberId: false, service: false, date: false, time: false,
    })
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
        setTouched(prev => ({ ...prev, [e.target.name]: true }))

    const errors = {
        name: !REGEX.name.test(form.name.trim()) ? 'Solo letras, mínimo 2 caracteres' : null,
        phone: !REGEX.phone.test(form.phone) ? 'Debe tener 10 dígitos' : null,
        barberId: !form.barberId ? 'Selecciona un barbero' : null,
        service: !form.service ? 'Selecciona un servicio' : null,
        date: !form.date ? 'Selecciona una fecha' : null,
        time: !form.time ? 'Selecciona una hora' : null,
    }

    const isValid = Object.values(errors).every(e => e === null)
    const today = new Date().toISOString().split('T')[0]

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setError(null)
        try {
            await createPublicAppointment(formData)
            setSuccess(true)
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error al agendar')
        } finally {
            setLoading(false)
        }
    }

    const inputClass = "w-full p-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 transition text-black text-sm"

    if (success) {
        return (
            <div className="text-center flex flex-col items-center gap-4 py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl">✓</div>
                <h2 className="text-xl font-semibold text-gray-900">¡Cita agendada!</h2>
                <p className="text-gray-500 text-sm max-w-xs">
                    Tu cita ha sido registrada. Te esperamos en la barbería.
                </p>
                <button
                    onClick={() => {
                        setSuccess(false)
                        setError(null)
                        setForm({ name: '', phone: '', barberId: '', service: '', date: '', time: '' })
                        setTouched({ name: false, phone: false, barberId: false, service: false, date: false, time: false })
                    }}
                    className="mt-2 text-sm text-blue-600 hover:underline"
                >
                    Agendar otra cita
                </button>
            </div>
        )
    }

    return (
        <form action={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Nombre completo *</label>
                <input
                    name="name" type="text" value={form.name}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="Ej. Juan Pérez"
                    className={inputClass}
                />
                {touched.name && errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Teléfono *</label>
                <input
                    name="phone" type="tel" value={form.phone}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="Ej. 2411234567"
                    maxLength={10}
                    onKeyDown={e => {
                        if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key))
                            e.preventDefault()
                    }}
                    className={inputClass}
                />
                {touched.phone && errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Barbero *</label>
                <select
                    name="barberId" value={form.barberId}
                    onChange={handleChange} onBlur={handleBlur}
                    className={`${inputClass} bg-white`}
                >
                    <option value="">Selecciona un barbero</option>
                    {barbers.map(b => (
                        <option key={b.id} value={b.id}>
                            {b.name}{b.specialty ? ` — ${b.specialty}` : ''}
                        </option>
                    ))}
                </select>
                {touched.barberId && errors.barberId && <p className="text-red-500 text-xs">{errors.barberId}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Servicio *</label>
                <select
                    name="service" value={form.service}
                    onChange={handleChange} onBlur={handleBlur}
                    className={`${inputClass} bg-white`}
                >
                    <option value="">Selecciona un servicio</option>
                    {services.map(s => (
                        <option key={s.id} value={s.name}>
                            {s.name} — ${s.price.toLocaleString('es-MX')} · {s.duration} min
                        </option>
                    ))}
                </select>
                {touched.service && errors.service && <p className="text-red-500 text-xs">{errors.service}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Fecha *</label>
                    <input
                        name="date" type="date" value={form.date} min={today}
                        onChange={handleChange} onBlur={handleBlur}
                        className={inputClass}
                    />
                    {touched.date && errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Hora *</label>
                    <input
                        name="time" type="time" value={form.time}
                        min="08:00" max="20:00"
                        onChange={handleChange} onBlur={handleBlur}
                        className={inputClass}
                    />
                    {touched.time && errors.time && <p className="text-red-500 text-xs">{errors.time}</p>}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={!isValid || loading}
                className="bg-black text-white py-3 rounded-lg text-sm font-medium transition-all hover:bg-neutral-800 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 mt-2"
            >
                {loading ? 'Agendando...' : 'Agendar cita'}
            </button>
        </form>
    )
}