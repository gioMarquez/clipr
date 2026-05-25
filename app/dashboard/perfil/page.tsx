import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'


export default async function PerfilPage() {
    const session = await getSession()
    if (!session) redirect('/login')

    const user = await prisma.user.findUnique({
        where: { id: session.id },
        select: { id: true, name: true, email: true, username: true, phone: true },
    })

    if (!user) redirect('/login')

    return (
        <div className="max-w-lg mx-auto flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Mi perfil</h1>
                <p className="text-sm text-gray-400 mt-1">Administra tu información personal</p>
            </div>
            <ProfileForm user={user} />
        </div>
    )
}