export enum AppointmentStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export interface User {
    id: string
    email: string
    username: string
    name: string
    phone?: string | null
    password: string
    createdAt: Date
    updatedAt: Date
}

export interface Barber {
    id: string
    name: string
    phone?: string | null
    specialty?: string | null
    appointments: Appointment[]
    createdAt: Date
    updatedAt: Date
}

export interface Client {
    id: string
    name: string
    phone?: string | null
    email?: string | null
    appointments: Appointment[]
    createdAt: Date
    updatedAt: Date
}

export interface Service {
    id: string
    name: string
    price: number
    duration: number // minutos
    description?: string | null
    appointments: Appointment[]
    createdAt: Date
    updatedAt: Date
}

export interface Appointment {
    id: string
    date: Date
    status: AppointmentStatus
    service: string
    price: number
    notes?: string | null

    barberId: string
    barber: Barber

    clientId: string
    client: Client

    serviceId?: string | null
    svc?: Service | null

    createdAt: Date
    updatedAt: Date
}