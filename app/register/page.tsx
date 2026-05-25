'use client'

import Image from "next/image"
import CustomInput from "../components/CustomInput"
import { registerUser } from "./actions"
import { useState } from "react"

const Page = () => {
    const [form, setForm] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    })

    const errors = {
        name:
            form.name !== '' &&
            !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/.test(form.name),

        username:
            form.username !== '' &&
            !/^[a-zA-Z0-9_]{4,20}$/.test(form.username),

        email:
            form.email !== '' &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),

        phone:
            form.phone !== '' &&
            !/^\d{10}$/.test(form.phone),

        password:
            form.password !== '' &&
            !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/.test(form.password),

        confirmPassword:
            form.confirmPassword !== '' &&
            form.password !== form.confirmPassword,
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const isValid =
        form.name.trim() !== '' &&
        form.username.trim() !== '' &&
        form.email.trim() !== '' &&
        form.password.trim() !== '' &&
        form.confirmPassword.trim() !== '' &&
        !errors.name &&
        !errors.username &&
        !errors.email &&
        !errors.phone &&
        !errors.password &&
        !errors.confirmPassword

    return (
        <div className="flex min-h-screen">
            <div className="w-1/2 flex items-center justify-center p-10">
                <form
                    action={registerUser}
                    className="w-full max-w-md flex flex-col gap-4"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-blue-500">
                            Registrarse
                        </h1>

                        <p className="text-gray-700 mt-2">
                            Bienvenido, por favor regístrate para poder continuar
                        </p>
                    </div>

                    {/* NAME */}
                    <div>
                        <CustomInput
                            name="name"
                            type="text"
                            placeholder="Nombre completo"
                            value={form.name}
                            onChange={handleChange}
                        />

                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                Nombre inválido
                            </p>
                        )}
                    </div>

                    {/* USERNAME */}
                    <div>
                        <CustomInput
                            name="username"
                            type="text"
                            placeholder="@username"
                            value={form.username}
                            onChange={handleChange}
                        />

                        {errors.username && (
                            <p className="text-red-500 text-sm mt-1">
                                Solo letras, números y "_" (4-20 caracteres)
                            </p>
                        )}
                    </div>

                    {/* EMAIL */}
                    <div>
                        <CustomInput
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                        />

                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                Email inválido
                            </p>
                        )}
                    </div>

                    {/* PHONE */}
                    <div>
                        <CustomInput
                            name="phone"
                            type="tel"
                            placeholder="Teléfono (opcional)"
                            value={form.phone}
                            onChange={handleChange}
                        />

                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">
                                Debe contener 10 dígitos
                            </p>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <CustomInput
                            name="password"
                            type="password"
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={handleChange}
                        />

                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 símbolo
                            </p>
                        )}
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div>
                        <CustomInput
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirmar contraseña"
                            value={form.confirmPassword}
                            onChange={handleChange}
                        />

                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                Las contraseñas no coinciden
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!isValid}
                        className="
                            bg-black
                            text-white
                            py-3
                            rounded-lg
                            transition-all
                            duration-300
                            hover:bg-neutral-800
                            hover:scale-[1.02]
                            hover:shadow-lg
                            active:scale-95
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            disabled:scale-100
                            disabled:shadow-none
                        "
                    >
                        Registrarse
                    </button>
                </form>
            </div>

            <div className="relative w-1/2">
                <Image
                    src="/img/login.jpg"
                    alt="img login"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    )
}

export default Page