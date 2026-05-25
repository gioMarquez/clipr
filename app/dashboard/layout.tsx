import Link from 'next/link'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'

const tabs = [
    { label: 'Resumen', href: '/dashboard' },
    { label: 'Calendario', href: '/dashboard/calendario' },
    { label: 'Clientes', href: '/dashboard/clientes' },
    { label: 'Barberos', href: '/dashboard/barberos' },
    { label: 'Reportes', href: '/dashboard/reportes' },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

    const session = await getSession()
    if (!session) redirect('/login')

    const initials = session.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-6">
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-lg">
                    ✂ CLIPR
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm">🔔</span>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-medium">
                            {initials}
                        </div>
                        {session.name}
                    </div>
                </div>
            </nav>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 px-6 flex gap-0">
                {tabs.map(tab => (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className="px-4 py-3 text-sm text-gray-500 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-all"
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>

            {/* Contenido */}
            <main className="p-6">
                {children}
            </main>
        </div>
    )
}