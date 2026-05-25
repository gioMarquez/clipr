'use client'

import { useState } from 'react'
import CustomInput from '@/app/components/CustomInput'
import { updateProfile, updatePassword } from './actions'

interface User {
    id: string
    name: string
    email: string
    username: string
    phone: string | null
}

export default function ProfileForm({ user }: { user: User }) {
    const [profile, setProfile] = useState({
        name: user.name,
        username: user.username,
        phone: user.phone ?? '',
    })

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const handleProfile = (e: React.ChangeEvent<HTMLInputElement>) =>
        setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
        setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const profileChanged =
        profile.name !== user.name ||
        profile.username !== user.username ||
        profile.phone !== (user.phone ?? '')

    const passwordValid =
        passwords.currentPassword !== '' &&
        passwords.newPassword !== '' &&
        passwords.newPassword === passwords.confirmPassword

    return (
        <>
            {/* Info personal */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xl font-medium">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                </div>

                <form action={updateProfile} className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-500">Nombre completo</label>
                            <CustomInput name="name" type="text" value={profile.name} onChange={handleProfile} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-500">Username</label>
                            <CustomInput name="username" type="text" value={profile.username} onChange={handleProfile} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Email</label>
                        <CustomInput name="email" type="email" value={user.email} disabled />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Teléfono</label>
                        <CustomInput name="phone" type="tel" value={profile.phone} onChange={handleProfile} placeholder="Teléfono (opcional)" />
                    </div>
                    <button
                        type="submit"
                        disabled={!profileChanged}
                        className="self-end bg-black text-white px-6 py-2 rounded-lg text-sm transition-all hover:bg-neutral-800 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        Guardar cambios
                    </button>
                </form>
            </div>

            {/* Cambiar contraseña */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
                <div className="pb-3 border-b border-gray-100">
                    <p className="font-medium text-gray-900">Cambiar contraseña</p>
                    <p className="text-xs text-gray-400 mt-1">Mínimo 8 caracteres</p>
                </div>

                <form action={updatePassword} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Contraseña actual</label>
                        <CustomInput name="currentPassword" type="password" value={passwords.currentPassword} onChange={handlePassword} placeholder="••••••••" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Nueva contraseña</label>
                        <CustomInput name="newPassword" type="password" value={passwords.newPassword} onChange={handlePassword} placeholder="••••••••" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Confirmar nueva contraseña</label>
                        <CustomInput name="confirmPassword" type="password" value={passwords.confirmPassword} onChange={handlePassword} placeholder="••••••••" />
                        {passwords.confirmPassword !== '' && passwords.newPassword !== passwords.confirmPassword && (
                            <p className="text-red-500 text-xs">Las contraseñas no coinciden</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={!passwordValid}
                        className="self-end bg-black text-white px-6 py-2 rounded-lg text-sm transition-all hover:bg-neutral-800 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        Cambiar contraseña
                    </button>
                </form>
            </div>
        </>
    )
}