'use client'

import Image from "next/image"
import CustomInput from "../components/CustomInput"
import { loginUser } from "./actions"

const Page = () => {
    return (
        <div className="flex min-h-screen">
            <div className="w-1/2 flex items-center justify-center p-10">
                <form action={loginUser} className="w-full max-w-md flex flex-col gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-blue-500">Iniciar sesión</h1>
                        <p className="text-gray-700 mt-2">
                            Bienvenido de vuelta, ingresa tus datos para continuar
                        </p>
                    </div>

                    <CustomInput name="email" type="email" placeholder="Email" />
                    <CustomInput name="password" type="password" placeholder="Contraseña" />

                    <div className="flex items-center justify-between text-sm text-black">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            Recuérdame
                        </label>
                        <p className="cursor-pointer hover:underline">
                            ¿Olvidaste tu contraseña?
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="bg-black text-white py-3 rounded-lg transition-all duration-300 hover:bg-neutral-800 hover:scale-[1.02] hover:shadow-lg active:scale-95"
                    >
                        Entrar
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        ¿No tienes cuenta?{' '}
                        <a href="/register" className="text-blue-500 hover:underline">
                            Regístrate
                        </a>
                    </p>
                </form>
            </div>

            <div className="relative w-1/2">
                <Image src="/img/login.jpg" alt="img login" fill className="object-cover" priority />
            </div>
        </div>
    )
}

export default Page