import Image from "next/image";
import CustomInput from "../components/CustomInput";

const Page = () => {
    return (
        <div className="flex min-h-screen">
            {/* FORMULARIO */}
            <div className="w-1/2 flex items-center justify-center p-10">
                <div className="w-full max-w-md flex flex-col gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-blue-500">Registrarse</h1>
                        <p className="text-gray-700 mt-2">
                            Bienvenido, por favor regístrate para poder continuar
                        </p>
                    </div>

                    <CustomInput
                        type="text"
                        placeholder="Email ID"
                    />

                    <CustomInput
                        type="password"
                        placeholder="Password"
                    />

                    <div className="flex items-center justify-between text-sm text-black">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            Remember me
                        </label>

                        <p className="cursor-pointer hover:underline">
                            ¿Olvidaste tu contraseña?
                        </p>
                    </div>

                    <button
                        className="
                            bg-black text-white py-3 rounded-lg
                            transition-all duration-300
                            hover:bg-neutral-800
                            hover:scale-[1.02]
                            hover:shadow-lg
                            active:scale-95
                        "
                    >
                        Entrar
                    </button>
                </div>
            </div>

            {/* IMAGEN */}
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
    );
};

export default Page;