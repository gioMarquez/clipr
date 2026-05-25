import Link from 'next/link'

const NotFound = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-9xl font-bold text-blue-500">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800">Página no encontrada</h2>
            <p className="text-gray-500">
                Lo sentimos, la página que buscas no existe.
            </p>
            <Link
                href="/"
                className="mt-4 bg-black text-white px-6 py-3 rounded-lg transition-all duration-300 hover:bg-neutral-800 hover:scale-[1.02] hover:shadow-lg active:scale-95"
            >
                Volver al inicio
            </Link>
        </div>
    )
}

export default NotFound